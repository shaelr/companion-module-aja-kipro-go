const MONITOR_CHANNEL_CHOICES = [
	{ id: '0', label: 'Ch 1' },
	{ id: '1', label: 'Ch 2' },
	{ id: '2', label: 'Ch 3' },
	{ id: '3', label: 'Ch 4' },
	{ id: '4', label: 'All Channels' },
]

const HEADPHONE_CHANNEL_CHOICES = [
	{ id: '0', label: 'Ch 1' },
	{ id: '1', label: 'Ch 2' },
	{ id: '2', label: 'Ch 3' },
	{ id: '3', label: 'Ch 4' },
]

const VIDEO_INPUT_CHOICES = [
	{ id: '0', label: 'SDI 1' },
	{ id: '1', label: 'SDI 2' },
	{ id: '2', label: 'SDI 3' },
	{ id: '3', label: 'SDI 4' },
	{ id: '4', label: 'HDMI 1' },
	{ id: '5', label: 'HDMI 2' },
	{ id: '6', label: 'HDMI 3' },
	{ id: '7', label: 'HDMI 4' },
]

const AUDIO_INPUT_CHOICES = [
	{ id: '0', label: 'Follows Video' },
	{ id: '1', label: 'Analog' },
]

const CHANNEL_NUMBER_CHOICES = [
	{ id: '1', label: 'Ch 1' },
	{ id: '2', label: 'Ch 2' },
	{ id: '3', label: 'Ch 3' },
	{ id: '4', label: 'Ch 4' },
]

// Device enum values for record destination / playback source (5-10)
const RECORD_DEST_CHOICES = [
	{ id: '5', label: 'USB 1' },
	{ id: '6', label: 'USB 2' },
	{ id: '7', label: 'USB 3' },
	{ id: '8', label: 'USB 4' },
	{ id: '9', label: 'USB 5' },
	{ id: '10', label: 'SMB' },
]

const BACKUP_DEST_CHOICES = [{ id: '0', label: 'None' }, ...RECORD_DEST_CHOICES]

const ANALOG_AUDIO_LEVEL_CHOICES = [
	{ id: '0', label: '+24dBu' },
	{ id: '1', label: '+18dBu' },
	{ id: '2', label: '+15dBu' },
	{ id: '3', label: '+12dBu' },
]

// eParamID_StorageCommand erase values, keyed by formatUSB drive option
const FORMAT_STORAGE_COMMAND = { 1: '5', 2: '6', 3: '7', 4: '8', 5: '9', All: '10' }

module.exports = {
	initActions() {
		let self = this
		let actions = {}

		let cmd = null

		actions.play = {
			name: 'Play',
			options: [],
			callback: async function (event) {
				cmd = 'TransportCommand&value=1'
				self.doCommand(cmd)
			},
		}

		actions.stop = {
			name: 'Stop',
			options: [],
			callback: async function (event) {
				cmd = 'TransportCommand&value=4'
				self.doCommand(cmd)
			},
		}

		actions.rec = {
			name: 'Record',
			options: [],
			callback: async function (event) {
				cmd = 'TransportCommand&value=3'
				self.doCommand(cmd)
			},
		}

		actions.next = {
			name: 'Next Clip',
			options: [],
			callback: async function (event) {
				cmd = 'TransportCommand&value=9'
				self.doCommand(cmd)
			},
		}

		actions.prv = {
			name: 'Previous Clip',
			options: [],
			callback: async function (event) {
				cmd = 'TransportCommand&value=10'
				self.doCommand(cmd)
			},
		}

		actions.ff = {
			name: 'Fast Forward',
			options: [],
			callback: async function (event) {
				cmd = 'TransportCommand&value=5'
				self.doCommand(cmd)
			},
		}

		actions.rev = {
			name: 'Fast Reverse',
			options: [],
			callback: async function (event) {
				cmd = 'TransportCommand&value=6'
				self.doCommand(cmd)
			},
		}

		actions.stepF = {
			name: 'Step Forward',
			options: [],
			callback: async function (event) {
				cmd = 'TransportCommand&value=7'
				self.doCommand(cmd)
			},
		}

		actions.stepB = {
			name: 'Step Back',
			options: [],
			callback: async function (event) {
				cmd = 'TransportCommand&value=8'
				self.doCommand(cmd)
			},
		}

		actions.format = {
			name: 'Format Drive',
			options: [],
			callback: async function (event) {
				cmd = 'StorageCommand&value=4&configid=0'
				self.doCommand(cmd)
			},
		}

		actions.formatUSB = {
			name: 'Format USB Drive (Ki Pro Go)',
			options: [
				{
					type: 'dropdown',
					label: 'Drive',
					id: 'value',
					default: '1',
					choices: [
						{ id: '1', label: 'USB 1' },
						{ id: '2', label: 'USB 2' },
						{ id: '3', label: 'USB 3' },
						{ id: '4', label: 'USB 4' },
						{ id: '5', label: 'USB 5' },
						{ id: 'All', label: 'All Drives' },
					],
				},
			],
			callback: async function (event) {
				// Same sequence as the device web UI: trigger the erase via StorageCommand,
				// then put the FormatMedia_USB_x selector back to "KEEP MEDIA"
				const storageCmd = FORMAT_STORAGE_COMMAND[event.options.value]
				if (!storageCmd) return
				self.doCommand(`StorageCommand&value=${storageCmd}&configid=0`)
				self.doCommand(`FormatMedia_USB_${event.options.value}&value=0&configid=0`)
			},
		}

		actions.eraseClip = {
			name: 'Erase Clip By Name',
			options: [
				{
					type: 'textinput',
					label: 'Clip Name',
					id: 'idx',
					default: '',
				},
			],
			callback: async function (event) {
				cmd = 'ClipToDelete&value=' + event.options.idx + '&configid=0'
				self.doCommand(cmd)
			},
		}

		actions.eraseClipByDrop = {
			name: 'Erase Clip By List',
			options: [
				{
					type: 'dropdown',
					label: 'Clip Name',
					id: 'idx',
					default: '',
					choices: self.availableClips,
				},
			],
			callback: async function (event) {
				cmd = 'ClipToDelete&value=' + event.options.idx + '&configid=0'
				self.doCommand(cmd)
			},
		}

		actions.customTake = {
			name: 'Set Custom Take Number',
			options: [
				{
					type: 'number',
					label: 'Take Name',
					id: 'idx',
					min: 0,
					max: 999,
					default: 0,
				},
			],
			callback: async function (event) {
				cmd = 'CustomTake&value=' + event.options.idx + '&configid=0'
				self.doCommand(cmd)
			},
		}

		actions.customClipName = {
			name: 'Set Custom Clip Name',
			options: [
				{
					type: 'textinput',
					label: 'Clip Name',
					id: 'clipname',
					default: '',
					useVariables: true,
				},
			],
			callback: async function (event) {
				let clipName = await self.parseVariablesInString(event.options.clipname)
				let setCmd = 'UseCustomClipName&value=1'
				self.doCommand(setCmd)

				cmd = 'CustomClipName&value=' + clipName
				self.doCommand(cmd)
			},
		}

		actions.customClipNameByChannel = {
			name: 'Set Channel x Custom Clip Name (Ki Pro Go)',
			options: [
				{
					type: 'number',
					label: 'Channel Number',
					id: 'channel',
					min: 1,
					max: 4,
					default: 1,
				},
				{
					type: 'textinput',
					label: 'Clip Name',
					id: 'clipname',
					default: '',
					useVariables: true,
				},
			],
			callback: async function (event) {
				let channelNumber = event.options.channel
				let clipName = await self.parseVariablesInString(event.options.clipname)

				cmd = 'Channel_' + channelNumber + '_Clipname&value=' + clipName
				self.doCommand(cmd)
			},
		}

		actions.load = {
			name: 'Load Clip By Name',
			options: [
				{
					type: 'textinput',
					label: 'Clip Name',
					id: 'idx',
					default: '',
				},
			],
			callback: async function (event) {
				cmd = 'GoToClip&value=' + event.options.idx
				self.doCommand(cmd)
			},
		}

		actions.loadByDrop = {
			name: 'Load Clip By List',
			options: [
				{
					type: 'dropdown',
					label: 'Clip Name',
					id: 'idx',
					default: '',
					choices: self.availableClips,
				},
			],
			callback: async function (event) {
				cmd = 'GoToClip&value=' + event.options.idx
				self.doCommand(cmd)
			},
		}

		actions.loop = {
			name: 'Loop Clip',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'idx',
					choices: [
						{ id: '0', label: 'Loop On' },
						{ id: '1', label: 'Loop Off' },
					],
				},
			],
			callback: async function (event) {
				cmd = 'LoopPlay&value=' + event.options.idx
				self.doCommand(cmd)
			},
		}

		actions.setTimecode = {
			name: 'Set Timecode Value',
			options: [
				{
					type: 'dropdown',
					label: 'Timecode',
					id: 'idx',
					default: '0',
					choices: [
						{ id: '0', label: '00:00:00:00' },
						{ id: '1', label: '01:00:00:00' },
						{ id: '2', label: '02:00:00:00' },
						{ id: '3', label: '03:00:00:00' },
						{ id: '4', label: '04:00:00:00' },
						{ id: '5', label: '05:00:00:00' },
						{ id: '6', label: '06:00:00:00' },
						{ id: '7', label: '07:00:00:00' },
						{ id: '8', label: '08:00:00:00' },
						{ id: '9', label: '09:00:00:00' },
						{ id: '10', label: '10:00:00:00' },
						{ id: '11', label: '11:00:00:00' },
						{ id: '12', label: '12:00:00:00' },
						{ id: '13', label: '13:00:00:00' },
						{ id: '14', label: '14:00:00:00' },
						{ id: '15', label: '15:00:00:00' },
						{ id: '16', label: '16:00:00:00' },
						{ id: '17', label: '17:00:00:00' },
						{ id: '18', label: '18:00:00:00' },
						{ id: '19', label: '19:00:00:00' },
						{ id: '20', label: '20:00:00:00' },
						{ id: '21', label: '21:00:00:00' },
						{ id: '22', label: '22:00:00:00' },
						{ id: '23', label: '23:00:00:00' },
					],
				},
			],
			callback: async function (event) {
				cmd = 'TimecodeValue&value=' + event.options.idx
				self.doCommand(cmd)
			},
		}

		actions.setMediaState = {
			name: 'Set Media State',
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'idx',
					choices: [
						{ id: '0', label: 'Record-Play' },
						{ id: '1', label: 'Data - LAN' },
					],
				},
			],
			callback: async function (event) {
				cmd = 'MediaState&value=' + event.options.idx
				self.doCommand(cmd)
			},
		}

		actions.setHDMIMonitorChannel = {
			name: 'Set HDMI Monitor Channel (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'value',
					default: '4',
					choices: MONITOR_CHANNEL_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = 'HDMIMonitorChannel&value=' + event.options.value
				self.doCommand(cmd)
			},
		}

		actions.setSDIMonitorChannel = {
			name: 'Set SDI Monitor Channel (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'value',
					default: '4',
					choices: MONITOR_CHANNEL_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = 'SDIMonitorChannel&value=' + event.options.value
				self.doCommand(cmd)
			},
		}

		actions.setHeadphoneMonitorChannel = {
			name: 'Set Headphone Monitor Channel (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'value',
					default: '0',
					choices: HEADPHONE_CHANNEL_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = 'HeadphoneMonitorChannel&value=' + event.options.value
				self.doCommand(cmd)
			},
		}

		actions.setUIMonitorChannel = {
			name: 'Set UI Monitor Channel (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'value',
					default: '4',
					choices: MONITOR_CHANNEL_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = 'UIMonitorChannel&value=' + event.options.value
				self.doCommand(cmd)
			},
		}

		actions.setVideoInput = {
			name: 'Set Video Input (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: '1',
					choices: CHANNEL_NUMBER_CHOICES,
				},
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: '0',
					choices: VIDEO_INPUT_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = `VideoInput_${event.options.channel}&value=${event.options.input}`
				self.doCommand(cmd)
			},
		}

		actions.setAudioInput = {
			name: 'Set Audio Input (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: '1',
					choices: CHANNEL_NUMBER_CHOICES,
				},
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: '0',
					choices: AUDIO_INPUT_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = `AudioInput_${event.options.channel}&value=${event.options.input}`
				self.doCommand(cmd)
			},
		}

		actions.setChEnable = {
			name: 'Enable/Disable Channel (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: '1',
					choices: CHANNEL_NUMBER_CHOICES,
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					default: '1',
					choices: [
						{ id: '0', label: 'Disable' },
						{ id: '1', label: 'Enable' },
					],
				},
			],
			callback: async function (event) {
				cmd = `Ch${event.options.channel}Enable&value=${event.options.value}`
				self.doCommand(cmd)
			},
		}

		actions.setRecordDest = {
			name: 'Set Record Destination (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: '1',
					choices: CHANNEL_NUMBER_CHOICES,
				},
				{
					type: 'dropdown',
					label: 'Destination',
					id: 'value',
					default: '5',
					choices: RECORD_DEST_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = `Channel_${event.options.channel}_Main_Record_Destination&value=${event.options.value}`
				self.doCommand(cmd)
			},
		}

		actions.setBackupDest = {
			name: 'Set Backup Record Destination (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: '1',
					choices: CHANNEL_NUMBER_CHOICES,
				},
				{
					type: 'dropdown',
					label: 'Backup Destination',
					id: 'value',
					default: '0',
					choices: BACKUP_DEST_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = `Channel_${event.options.channel}_Backup_Record_Destination&value=${event.options.value}`
				self.doCommand(cmd)
			},
		}

		actions.setPlaybackSource = {
			name: 'Set Playback Source (Ki Pro GO)',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'value',
					default: '5',
					choices: RECORD_DEST_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = `PlaybackMediaSource&value=${event.options.value}`
				self.doCommand(cmd)
			},
		}

		actions.setAnalogAudioLevel = {
			name: 'Set Analog Audio Input Level (Ki Pro GO)',
			description: 'Analog input reference level (headroom). This is the only analog gain control the device exposes.',
			options: [
				{
					type: 'dropdown',
					label: 'Level',
					id: 'value',
					default: '0',
					choices: ANALOG_AUDIO_LEVEL_CHOICES,
				},
			],
			callback: async function (event) {
				cmd = `AnalogAudioStandard&value=${event.options.value}`
				self.doCommand(cmd)
			},
		}

		self.setActionDefinitions(actions)
	},
}
