import { InstanceStatus } from '@companion-module/base'

// Long-polls (wait_for_config_events) return within a few seconds; this only guards against a hung request
const HTTP_TIMEOUT_MS = 30000

export default {
	startConnectTimer() {
		let timeout = 5000

		// Stop the timer if it was already running
		this.stopConnectTimer()

		this.log('debug', 'Starting connection timer')
		// Create a reconnect timer to watch the socket. If disconnected try to connect.
		this.connectTimer = setInterval(
			function () {
				//Auth Enabled
				if (this.config.password && this.config.password !== '') {
					if (!this.authenticated) {
						//Not Authenticated so send password
						this.doAuthenticate()
					} else {
						//Authenticated so connect
						this.doConnect()
					}
				} else {
					//Auth Disabled
					this.doConnect()
				}
			}.bind(this),
			timeout
		)
	},

	stopConnectTimer() {
		if (this.connectTimer !== undefined) {
			this.log('debug', 'Stopping connection timer')
			clearInterval(this.connectTimer)
			delete this.connectTimer
		}
	},

	startRequestTimer() {
		// Stop the timer if it was already running
		this.stopRequestTimer()
		this.stopConnectTimer()

		let refreshRate = 50000 //Keep connection alive for authentication if polling is disabled

		if (this.config.polling) {
			refreshRate = this.config.pollingRate
		}

		this.log('debug', 'Starting request timer')
		this.requestTimer = setInterval(
			function () {
				this.doRequestUpdate()
			}.bind(this),
			refreshRate
		)
	},

	stopRequestTimer() {
		if (this.requestTimer !== undefined) {
			this.log('debug', 'Stopping request timer')
			clearInterval(this.requestTimer)
			delete this.requestTimer
		}
	},

	doAuthenticate() {
		if (!this.waiting) {
			this.waiting = true

			this.request('/authenticator/login', {
				method: 'POST',
				body: 'password_provided=' + this.config.password,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': 'curl/7.64.1',
					Accept: '*/*',
				},
			})
		}
	},

	// Fetch a path on the Ki Pro. Resolves to { data: Buffer, response: { statusCode, headers } }
	async httpRequest(path, options = {}) {
		const headers = { ...options.headers }
		if (this.authenticated && this.authToken) {
			headers['Cookie'] = this.authToken
		}

		const res = await fetch('http://' + this.config.host + path, {
			method: options.method ?? 'GET',
			body: options.body,
			headers,
			signal: AbortSignal.timeout(options.timeoutMs ?? HTTP_TIMEOUT_MS),
		})
		const data = Buffer.from(await res.arrayBuffer())

		return { data, response: { statusCode: res.status, headers: { 'set-cookie': res.headers.getSetCookie() } } }
	},

	// Fetch a path and pass the result to handleReply
	request(path, options) {
		this.httpRequest(path, options).then(
			(result) => this.handleReply(null, result),
			(error) => this.handleReply(true, { error }),
		)
	},

	handleReply(err, data) {
		let objJson = {}

		if (err) {
			const errorCode = data.error?.code ?? data.error?.cause?.code
			if (errorCode == 'HPE_UNEXPECTED_CONTENT_LENGTH') {
				this.log('warn', 'Non-compliant header recieved. Polling disabled. See help file for details')
				this.updateStatus(InstanceStatus.Ok, 'No Polling')
				this.config.polling = false
				this.saveConfig()
				this.authenticated = false
				this.authToken = ''
				this.connectionID = 0
				this.stopRequestTimer()
				this.stopConnectTimer()
				this.waiting = false
				return
			} else {
				this.log('error', 'Error connecting to KiPro: ' + (data.error?.cause?.message ?? data.error?.message ?? data.error))
				this.updateStatus(InstanceStatus.ConnectionFailure, 'Error connecting to KiPro')
				this.authenticated = false
				this.authToken = ''
				this.connectionID = 0
				this.stopRequestTimer()
				this.startConnectTimer()
				this.waiting = false
				return
			}
		} else {
			if (data.data) {
				if (data.response.statusCode === 200) {
					if (data.data.length) {
						if (data.data.length > 0) {
							try {
								objJson = JSON.parse(data.data.toString())
								//If connection response
								if (objJson['connectionid'] != undefined) {
									this.processConnection(objJson)
								}
								//Clips response
								else if (objJson['clips'] != undefined) {
									this.processClips(objJson['clips'])
								}
								//login Response
								else if (objJson['login'] !== undefined) {
									this.processLogin(objJson['login'], data.response.headers)
								}
								//Poll response
								else if (this.config.polling) {
									//Polling is active so update the variables
									this.processPollingResponse(objJson)
								}
							} catch (error) {}
						}
					}
				} else {
					this.log('error', 'Status ' + data.response.statusCode)
					this.updateStatus(InstanceStatus.ConnectionFailure, 'HTTP status ' + data.response.statusCode)
					this.authenticated = false
					this.authToken = ''
					this.connectionID = 0
					this.stopRequestTimer()
					this.startConnectTimer()
					this.waiting = false
					return
				}
			}
			this.waiting = false
			return
		}
	},

	processCurrentSpeed(speed) {
		switch (speed) {
			case 2:
				this.state['TransportState'] = 'FORWARD_2X'
				break
			case 4:
				this.state['TransportState'] = 'FORWARD_4X'
				break
			case 8:
				this.state['TransportState'] = 'FORWARD_8X'
				break
			case 16:
				this.state['TransportState'] = 'FORWARD_16X'
				break
			case 32:
				this.state['TransportState'] = 'FORWARD_32X'
				break
			case -1:
				this.state['TransportState'] = 'REVERSE'
				break
			case -2:
				this.state['TransportState'] = 'REVERSE_2X'
				break
			case -4:
				this.state['TransportState'] = 'REVERSE_4X'
				break
			case -8:
				this.state['TransportState'] = 'REVERSE_8X'
				break
			case -16:
				this.state['TransportState'] = 'REVERSE_16X'
				break
			case -32:
				this.state['TransportState'] = 'REVERSE_32X'
				break
		}

		this.checkVariables()
		this.checkAllFeedbacks()

		return 1
	},

	processCurrentState(state) {
		switch (state) {
			//Cases 3-7 and 9-13 are handled by eParamID_TransportCurrentSpeed
			case 0:
				this.state['TransportState'] = 'UNKNOWN'
				break
			case 1:
				this.state['TransportState'] = 'IDLE'
				break
			case 2:
				this.state['TransportState'] = 'RECORDING'
				break
			case 3:
				this.state['TransportState'] = 'FORWARD'
				break
			case 8:
				this.state['TransportState'] = 'FORWARD_STEP'
				break
			case 14:
				this.state['TransportState'] = 'REVERSE_STEP'
				break
			case 15:
				this.state['TransportState'] = 'PAUSED'
				break
			case 16:
				this.state['TransportState'] = 'IDLE_ERROR'
				break
			case 17:
				this.state['TransportState'] = 'RECORD_ERROR'
				break
			case 18:
				this.state['TransportState'] = 'PLAY_ERROR'
				break
			case 19:
				this.state['TransportState'] = 'PAUSE_ERROR'
				break
			case 20:
				this.state['TransportState'] = 'SHUTDOWN'
				break
		}

		this.checkVariables()
		this.checkAllFeedbacks()

		return 1
	},

	processTimecode(fullTimecode) {
		let timecode = fullTimecode.split(/:|;/)

		this.state['TC_hours'] = timecode[0]
		this.state['TC_min'] = timecode[1]
		this.state['TC_sec'] = timecode[2]
		this.state['TC_frames'] = timecode[3]

		this.checkVariables()
		this.checkAllFeedbacks()

		return 1
	},

	processLogin(loginStatus, headers) {
		if (loginStatus === 'success') {
			this.authenticated = true
			this.authToken = headers['set-cookie'][0]
			this.connectionID = 0
			this.log('debug', 'Authenticated')
		} else if (loginStatus === 'Login Failed - Passwords did not match') {
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Password does not match')
			this.authenticated = false
			this.authToken = ''
			this.connectionID = 0
			this.log('error', 'Password does not match')
		} else {
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Authentication Error')
			this.authenticated = false
			this.authToken = ''
			this.connectionID = 0
			this.log('error', 'Authentication Error')
		}
		return 1
	},

	processConnection(objJson) {
		this.connectionID = Number(objJson['connectionid'])
		if (this.connectionID) {
			this.updateStatus(InstanceStatus.Ok)
			this.log('debug', 'Connected')
			this.doGetClips()
			this.stopConnectTimer()
			this.startRequestTimer()
			// Success

			if (this.config.polling) {
				//Polling is active so update the variables
				if (objJson['configevents'] != undefined) {
					//This will pick up initial values on connection
					for (let item of objJson['configevents']) {
						if ('eParamID_TransportTimecode' in item) {
							this.processTimecode(item['eParamID_TransportTimecode'])
						}

						if ('eParamID_TransportCurrentSpeed' in item) {
							this.processCurrentSpeed(Number(item['eParamID_TransportCurrentSpeed']))
						}

						if ('eParamID_TransportState' in item) {
							this.processCurrentState(Number(item['eParamID_TransportState']))
						}

						if ('eParamID_CurrentClip' in item) {
							this.state['CurrentClip'] = item['eParamID_CurrentClip']
						}

						if ('eParamID_CurrentMediaAvailable' in item) {
							this.state['MediaAvailable'] = item['eParamID_CurrentMediaAvailable'] + '%'
						}

						if ('eParamID_SysName' in item) {
							this.state['SystemName'] = item['eParamID_SysName']
						}

						if ('eParamID_HDMIMonitorChannel' in item) {
							this.state['HDMIMonitorChannel'] = String(item['eParamID_HDMIMonitorChannel'])
						}

						if ('eParamID_SDIMonitorChannel' in item) {
							this.state['SDIMonitorChannel'] = String(item['eParamID_SDIMonitorChannel'])
						}

						if ('eParamID_HeadphoneMonitorChannel' in item) {
							this.state['HeadphoneMonitorChannel'] = String(item['eParamID_HeadphoneMonitorChannel'])
						}

						if ('eParamID_StoragePath' in item) {
							this.state['StoragePath'] = item['eParamID_StoragePath']
						}

						if ('eParamID_AnalogAudioStandard' in item) {
							this.state['AnalogAudioStandard'] = String(item['eParamID_AnalogAudioStandard'])
						}

						for (let ch = 1; ch <= 4; ch++) {
							const vidKey = `eParamID_VideoInput_${ch}`
							if (vidKey in item) {
								this.state[`VideoInput_${ch}`] = String(item[vidKey])
							}
							const audKey = `eParamID_AudioInput_${ch}`
							if (audKey in item) {
								this.state[`AudioInput_${ch}`] = String(item[audKey])
							}
						}
					}
				}
				this.checkVariables()
				this.checkAllFeedbacks()
				// fetch static params once on connect
				this.doGetParam('eParamID_SWVersion', (obj) => {
					if (obj && obj.value != null) {
						this.state['SWVersion'] = this.processSWVersion(obj.value)
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_RecordFormat', (obj) => {
					if (obj && obj.value_name != null) {
						this.state['RecordFormat'] = obj.value_name
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_EncodeChannels', (obj) => {
					if (obj && obj.value_name != null) {
						this.state['EncodeChannels'] = obj.value_name
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_ClipName', (obj) => {
					if (obj && obj.value_name != null) {
						this.state['ClipName'] = obj.value_name
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_ClipNumber', (obj) => {
					if (obj && obj.value != null) {
						this.state['ClipNumber'] = String(obj.value)
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_Take', (obj) => {
					if (obj && obj.value != null) {
						this.state['Take'] = String(obj.value)
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_CurrentlyRunningImageVersion', (obj) => {
					if (obj && obj.value != null) {
						this.state['FirmwareVersion'] = String(obj.value)
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_VolumeName', (obj) => {
					if (obj && obj.value_name != null) {
						this.state['VolumeName'] = obj.value_name
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_UIMonitorChannel', (obj) => {
					if (obj && obj.value != null) {
						this.state['UIMonitorChannel'] = String(obj.value)
						this.checkVariables()
						this.checkAllFeedbacks()
					}
				})
				this.doGetParam('eParamID_VideoEncoder', (obj) => {
					if (obj && obj.value_name != null) {
						this.state['VideoEncoder'] = obj.value_name
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_FileType', (obj) => {
					if (obj && obj.value_name != null) {
						this.state['FileType'] = obj.value_name
						this.checkVariables()
					}
				})
				this.doGetParam('eParamID_PlaybackMediaSource', (obj) => {
					if (obj && obj.value != null) {
						this.state['PlaybackSource'] = String(obj.value)
						this.checkVariables()
						this.checkAllFeedbacks()
					}
				})
				for (let _slot = 1; _slot <= 5; _slot++) {
					;((_s) => {
						this.doGetParam(`eParamID_Media_Slot_${_s}_State`, (obj) => {
							if (obj && obj.value != null) {
								this.state[`MediaSlot${_s}State`] = String(obj.value)
								this.checkVariables()
								this.checkAllFeedbacks()
							}
						})
						this.doGetParam(`eParamID_Media_Slot_${_s}_Remaining_Percent`, (obj) => {
							if (obj && obj.value != null) {
								this.state[`MediaSlot${_s}Percent`] = String(obj.value)
								this.checkVariables()
							}
						})
						this.doGetParam(`eParamID_Media_Slot_${_s}_Remaining_Capacity`, (obj) => {
							if (obj && obj.value != null) {
								const kb = Number(obj.value)
								this.state[`MediaSlot${_s}CapacityGB`] = isNaN(kb) ? '' : (kb / 1048576).toFixed(1)
								this.checkVariables()
							}
						})
					})(_slot)
				}
				for (let _ch = 1; _ch <= 4; _ch++) {
					;((_c) => {
						this.doGetParam(`eParamID_Ch${_c}Enable`, (obj) => {
							if (obj && obj.value != null) {
								this.state[`Ch${_c}Enable`] = String(obj.value)
								this.checkVariables()
								this.checkAllFeedbacks()
							}
						})
						this.doGetParam(`eParamID_Channel_${_c}_InputFormat`, (obj) => {
							if (obj && (obj.value_name != null || obj.value != null)) {
								this.state[`Ch${_c}InputFormat`] = obj.value_name || String(obj.value)
								this.checkVariables()
							}
						})
						this.doGetParam(`eParamID_Channel_${_c}_Main_Record_Destination`, (obj) => {
							if (obj && obj.value != null) {
								this.state[`Ch${_c}RecordDest`] = String(obj.value)
								this.checkVariables()
								this.checkAllFeedbacks()
							}
						})
						this.doGetParam(`eParamID_Channel_${_c}_Backup_Record_Destination`, (obj) => {
							if (obj && obj.value != null) {
								this.state[`Ch${_c}BackupDest`] = String(obj.value)
								this.checkVariables()
								this.checkAllFeedbacks()
							}
						})
					})(_ch)
				}
			}
		} else {
			this.log('error', 'Connection Error')
			this.updateStatus(InstanceStatus.ConnectionFailure)
			this.authenticated = false
			this.authToken = ''
			this.connectionID = 0
			this.stopRequestTimer()
			this.startConnectTimer()
			this.waiting = false
		}
		return 1
	},

	processClips(clips) {
		this.availableClips = []
		for (let clip of clips) {
			this.availableClips.push({ id: clip['clipname'], label: clip['clipname'] })
		}
		this.initActions()
		return 1
	},

	processPollingResponse(objJson) {
		//if an array, loop through the array and update variables based on param_id
		//if not an array, check the name property and update variables based on that

		if (!Array.isArray(objJson)) {
			objJson = [objJson]
		}

		for (let item of objJson) {
			if (item['param_id'] != undefined) {
				let _sm
				if ((_sm = item['param_id'].match(/^eParamID_Media_Slot_(\d)_State$/))) {
					this.state[`MediaSlot${_sm[1]}State`] = String(item['int_value'] ?? '')
					this.checkVariables()
					this.checkAllFeedbacks()
				} else if ((_sm = item['param_id'].match(/^eParamID_Media_Slot_(\d)_Remaining_Percent$/))) {
					this.state[`MediaSlot${_sm[1]}Percent`] = String(item['int_value'] ?? '')
					this.checkVariables()
				} else if ((_sm = item['param_id'].match(/^eParamID_Media_Slot_(\d)_Remaining_Capacity$/))) {
					const _kb = Number(item['int_value'])
					this.state[`MediaSlot${_sm[1]}CapacityGB`] = isNaN(_kb) ? '' : (_kb / 1048576).toFixed(1)
					this.checkVariables()
				} else {
				switch (item['param_id']) {
					case 'eParamID_TransportTimecode':
						this.processTimecode(item['str_value'])
						break
					case 'eParamID_TransportCurrentSpeed':
						this.processCurrentSpeed(Number(item['str_value']))
						break
					case 'eParamID_TransportState':
						this.processCurrentState(Number(item['int_value']))
						break
					case 'eParamID_MediaState':
						this.state['MediaState'] = item['str_value']
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_CurrentClip':
						this.state['CurrentClip'] = item['str_value']
						break
					case 'eParamID_CurrentMediaAvailable':
						this.state['MediaAvailable'] = item['int_value'] + '%'
						break
					case 'eParamID_SysName':
						this.state['SystemName'] = item['str_value']
						break
					case 'eParamID_MediaUpdated':
						this.doGetClips()
						break
					case 'eParamID_HDMIMonitorChannel':
						this.state['HDMIMonitorChannel'] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_SDIMonitorChannel':
						this.state['SDIMonitorChannel'] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_HeadphoneMonitorChannel':
						this.state['HeadphoneMonitorChannel'] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_VideoInput_1':
					case 'eParamID_VideoInput_2':
					case 'eParamID_VideoInput_3':
					case 'eParamID_VideoInput_4':
						this.state[item['param_id'].replace('eParamID_', '')] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_AudioInput_1':
					case 'eParamID_AudioInput_2':
					case 'eParamID_AudioInput_3':
					case 'eParamID_AudioInput_4':
						this.state[item['param_id'].replace('eParamID_', '')] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_StoragePath':
						this.state['StoragePath'] = item['str_value']
						this.checkVariables()
						break
					case 'eParamID_AnalogAudioStandard':
						this.state['AnalogAudioStandard'] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_RecordFormat':
						this.state['RecordFormat'] = item['str_value']
						this.checkVariables()
						break
					case 'eParamID_EncodeChannels':
						this.state['EncodeChannels'] = item['str_value']
						this.checkVariables()
						break
					case 'eParamID_ClipName':
						this.state['ClipName'] = item['str_value']
						this.checkVariables()
						break
					case 'eParamID_ClipNumber':
						this.state['ClipNumber'] = item['str_value']
						this.checkVariables()
						break
					case 'eParamID_Take':
						this.state['Take'] = item['str_value']
						this.checkVariables()
						break
					case 'eParamID_UIMonitorChannel':
						this.state['UIMonitorChannel'] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_Ch1Enable':
					case 'eParamID_Ch2Enable':
					case 'eParamID_Ch3Enable':
					case 'eParamID_Ch4Enable':
						this.state[item['param_id'].replace('eParamID_', '')] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_Channel_1_InputFormat':
					case 'eParamID_Channel_2_InputFormat':
					case 'eParamID_Channel_3_InputFormat':
					case 'eParamID_Channel_4_InputFormat': {
						const _ifCh = item['param_id'].match(/Channel_(\d)_InputFormat/)[1]
						this.state[`Ch${_ifCh}InputFormat`] = item['str_value'] || ''
						this.checkVariables()
						break
					}
					case 'eParamID_Channel_1_Main_Record_Destination':
					case 'eParamID_Channel_2_Main_Record_Destination':
					case 'eParamID_Channel_3_Main_Record_Destination':
					case 'eParamID_Channel_4_Main_Record_Destination': {
						const _rdCh = item['param_id'].match(/Channel_(\d)_Main/)[1]
						this.state[`Ch${_rdCh}RecordDest`] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					}
					case 'eParamID_Channel_1_Backup_Record_Destination':
					case 'eParamID_Channel_2_Backup_Record_Destination':
					case 'eParamID_Channel_3_Backup_Record_Destination':
					case 'eParamID_Channel_4_Backup_Record_Destination': {
						const _bdCh = item['param_id'].match(/Channel_(\d)_Backup/)[1]
						this.state[`Ch${_bdCh}BackupDest`] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					}
					case 'eParamID_PlaybackMediaSource':
						this.state['PlaybackSource'] = String(item['int_value'])
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_VideoEncoder':
						this.state['VideoEncoder'] = item['str_value'] || ''
						this.checkVariables()
						break
					case 'eParamID_FileType':
						this.state['FileType'] = item['str_value'] || ''
						this.checkVariables()
						break
					case 'eParamID_CurrentlyRunningImageVersion':
						this.state['FirmwareVersion'] = item['str_value'] || ''
						this.checkVariables()
						break
					case 'eParamID_VolumeName':
						this.state['VolumeName'] = item['str_value'] || ''
						this.checkVariables()
						break
				}
				} // end else
			}

			if (item['name'] != undefined) {
				switch (item['name']) {
					case 'eParamID_MediaState':
						this.state['MediaState'] = item['value']
						this.checkVariables()
						this.checkAllFeedbacks()
						break
					case 'eParamID_RecordFormat':
						this.state['RecordFormat'] = item['value_name'] || item['value']
						this.checkVariables()
						break
					case 'eParamID_EncodeChannels':
						this.state['EncodeChannels'] = item['value_name'] || item['value']
						this.checkVariables()
						break
					case 'eParamID_ClipName':
						this.state['ClipName'] = item['value_name'] || item['value']
						this.checkVariables()
						break
					case 'eParamID_ClipNumber':
						this.state['ClipNumber'] = String(item['value'])
						this.checkVariables()
						break
					case 'eParamID_Take':
						this.state['Take'] = String(item['value'])
						this.checkVariables()
						break
				}
			}
		}
		return 1
	},

	processSWVersion(value) {
		const num = Number(value)
		const oct1 = (num >>> 24) & 0xff
		const oct2 = (num >>> 16) & 0xff
		const oct3 = (num >>> 8) & 0xff
		const oct4 = num & 0xff
		return `${oct1}.${oct2}.${oct3}.${oct4}`
	},

	doGetParam(paramid, callback) {
		this.httpRequest('/config?action=get&paramid=' + paramid + '&configid=0').then(
			({ data, response }) => {
				try {
					if (response.statusCode === 200 && data.length > 0) {
						callback(JSON.parse(data.toString()))
					}
				} catch (e) {}
			},
			() => {},
		)
	},

	doCommand(cmd) {
		this.request('/config?action=set&paramid=eParamID_' + cmd)
	},

	doConnect() {
		if (!this.waiting) {
			this.waiting = true
			this.request('/json?action=connect&configid=0')
		}
	},

	doGetClips() {
		this.request('/clips?action=get_clips')
	},

	doRequestUpdate() {
		if (!this.waiting) {
			this.waiting = true

			this.request('/json?action=wait_for_config_events&configid=0&connectionid=' + this.connectionID)

			//also get mediastate
			this.request('/json?action=get&paramid=eParamID_MediaState')
		}
	},
}
