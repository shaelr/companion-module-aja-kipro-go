const MONITOR_CHANNEL_LABELS = ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4', 'All Channels']
const VIDEO_INPUT_LABELS = ['SDI 1', 'SDI 2', 'SDI 3', 'SDI 4', 'HDMI 1', 'HDMI 2', 'HDMI 3', 'HDMI 4']
const AUDIO_INPUT_LABELS = ['Follows Video', 'Analog']
const MEDIA_SLOT_STATE_LABELS = ['Unknown', 'Mounting', 'Read-Only', 'Ready', 'Unmounting', 'Unmounted', '', '', '', 'Error']
// Device enum values for record destination / playback source (5-10, 0 = None for backup)
const RECORD_DEST_LABELS = { 0: 'None', 5: 'USB 1', 6: 'USB 2', 7: 'USB 3', 8: 'USB 4', 9: 'USB 5', 10: 'SMB' }
const ANALOG_AUDIO_LEVEL_LABELS = ['+24dBu', '+18dBu', '+15dBu', '+12dBu']

module.exports = {
	initVariables() {
		let variables = [
			{ name: 'TimeCode Hours', variableId: 'TC_hours' },
			{ name: 'TimeCode Minutes', variableId: 'TC_min' },
			{ name: 'TimeCode Seconds', variableId: 'TC_sec' },
			{ name: 'TimeCode Frames', variableId: 'TC_frames' },
			{ name: 'Transport State', variableId: 'TransportState' },
			{ name: 'Media State', variableId: 'MediaState' },
			{ name: 'Current Clip', variableId: 'CurrentClip' },
			{ name: 'Media Available', variableId: 'MediaAvailable' },
			{ name: 'System Name', variableId: 'SystemName' },
			{ name: 'HDMI Monitor Channel', variableId: 'HDMIMonitorChannel' },
			{ name: 'SDI Monitor Channel', variableId: 'SDIMonitorChannel' },
			{ name: 'Headphone Monitor Channel', variableId: 'HeadphoneMonitorChannel' },
			{ name: 'UI Monitor Channel', variableId: 'UIMonitorChannel' },
			{ name: 'Video Input Ch 1', variableId: 'VideoInput_1' },
			{ name: 'Video Input Ch 2', variableId: 'VideoInput_2' },
			{ name: 'Video Input Ch 3', variableId: 'VideoInput_3' },
			{ name: 'Video Input Ch 4', variableId: 'VideoInput_4' },
			{ name: 'Audio Input Ch 1', variableId: 'AudioInput_1' },
			{ name: 'Audio Input Ch 2', variableId: 'AudioInput_2' },
			{ name: 'Audio Input Ch 3', variableId: 'AudioInput_3' },
			{ name: 'Audio Input Ch 4', variableId: 'AudioInput_4' },
			{ name: 'Storage Path', variableId: 'StoragePath' },
			{ name: 'Firmware Version (packed)', variableId: 'SWVersion' },
			{ name: 'Firmware Version', variableId: 'FirmwareVersion' },
			{ name: 'Volume Name', variableId: 'VolumeName' },
			{ name: 'Record Format', variableId: 'RecordFormat' },
			{ name: 'Encode Channels', variableId: 'EncodeChannels' },
			{ name: 'Clip Name', variableId: 'ClipName' },
			{ name: 'Clip Number', variableId: 'ClipNumber' },
			{ name: 'Take', variableId: 'Take' },
			{ name: 'Video Encoder', variableId: 'VideoEncoder' },
			{ name: 'File Type', variableId: 'FileType' },
			{ name: 'Playback Source', variableId: 'PlaybackSource' },
			{ name: 'Analog Audio Input Level', variableId: 'AnalogAudioStandard' },
			{ name: 'Audio Meter Left (dB)', variableId: 'AudioLevelL' },
			{ name: 'Audio Meter Right (dB)', variableId: 'AudioLevelR' },
			{ name: 'Ch 1 Enable', variableId: 'Ch1Enable' },
			{ name: 'Ch 2 Enable', variableId: 'Ch2Enable' },
			{ name: 'Ch 3 Enable', variableId: 'Ch3Enable' },
			{ name: 'Ch 4 Enable', variableId: 'Ch4Enable' },
			{ name: 'Ch 1 Input Format', variableId: 'Ch1InputFormat' },
			{ name: 'Ch 2 Input Format', variableId: 'Ch2InputFormat' },
			{ name: 'Ch 3 Input Format', variableId: 'Ch3InputFormat' },
			{ name: 'Ch 4 Input Format', variableId: 'Ch4InputFormat' },
			{ name: 'Ch 1 Record Dest', variableId: 'Ch1RecordDest' },
			{ name: 'Ch 2 Record Dest', variableId: 'Ch2RecordDest' },
			{ name: 'Ch 3 Record Dest', variableId: 'Ch3RecordDest' },
			{ name: 'Ch 4 Record Dest', variableId: 'Ch4RecordDest' },
			{ name: 'Ch 1 Backup Dest', variableId: 'Ch1BackupDest' },
			{ name: 'Ch 2 Backup Dest', variableId: 'Ch2BackupDest' },
			{ name: 'Ch 3 Backup Dest', variableId: 'Ch3BackupDest' },
			{ name: 'Ch 4 Backup Dest', variableId: 'Ch4BackupDest' },
			{ name: 'USB 1 State', variableId: 'MediaSlot1State' },
			{ name: 'USB 2 State', variableId: 'MediaSlot2State' },
			{ name: 'USB 3 State', variableId: 'MediaSlot3State' },
			{ name: 'USB 4 State', variableId: 'MediaSlot4State' },
			{ name: 'USB 5 State', variableId: 'MediaSlot5State' },
			{ name: 'USB 1 Remaining %', variableId: 'MediaSlot1Percent' },
			{ name: 'USB 2 Remaining %', variableId: 'MediaSlot2Percent' },
			{ name: 'USB 3 Remaining %', variableId: 'MediaSlot3Percent' },
			{ name: 'USB 4 Remaining %', variableId: 'MediaSlot4Percent' },
			{ name: 'USB 5 Remaining %', variableId: 'MediaSlot5Percent' },
			{ name: 'USB 1 Free Space (GB)', variableId: 'MediaSlot1CapacityGB' },
			{ name: 'USB 2 Free Space (GB)', variableId: 'MediaSlot2CapacityGB' },
			{ name: 'USB 3 Free Space (GB)', variableId: 'MediaSlot3CapacityGB' },
			{ name: 'USB 4 Free Space (GB)', variableId: 'MediaSlot4CapacityGB' },
			{ name: 'USB 5 Free Space (GB)', variableId: 'MediaSlot5CapacityGB' },
		]

		this.setVariableDefinitions(variables)
	},

	checkVariables() {
		try {
			let variableObj = {}

			variableObj['TC_hours'] = this.state['TC_hours']
			variableObj['TC_min'] = this.state['TC_min']
			variableObj['TC_sec'] = this.state['TC_sec']
			variableObj['TC_frames'] = this.state['TC_frames']
			variableObj['TransportState'] = this.state['TransportState']
			variableObj['MediaState'] = this.state['MediaState'] == '0' ? 'Record-Play' : 'Data - LAN'
			variableObj['CurrentClip'] = this.state['CurrentClip']
			variableObj['MediaAvailable'] = this.state['MediaAvailable']
			variableObj['SystemName'] = this.state['SystemName']

			variableObj['HDMIMonitorChannel'] =
				this.state['HDMIMonitorChannel'] != null
					? (MONITOR_CHANNEL_LABELS[Number(this.state['HDMIMonitorChannel'])] ?? '')
					: ''
			variableObj['SDIMonitorChannel'] =
				this.state['SDIMonitorChannel'] != null
					? (MONITOR_CHANNEL_LABELS[Number(this.state['SDIMonitorChannel'])] ?? '')
					: ''
			variableObj['HeadphoneMonitorChannel'] =
				this.state['HeadphoneMonitorChannel'] != null
					? (MONITOR_CHANNEL_LABELS[Number(this.state['HeadphoneMonitorChannel'])] ?? '')
					: ''
			variableObj['UIMonitorChannel'] =
				this.state['UIMonitorChannel'] != null
					? (MONITOR_CHANNEL_LABELS[Number(this.state['UIMonitorChannel'])] ?? '')
					: ''

			for (let ch = 1; ch <= 4; ch++) {
				const vidVal = this.state[`VideoInput_${ch}`]
				variableObj[`VideoInput_${ch}`] =
					vidVal != null ? (VIDEO_INPUT_LABELS[Number(vidVal)] ?? '') : ''

				const audVal = this.state[`AudioInput_${ch}`]
				variableObj[`AudioInput_${ch}`] =
					audVal != null ? (AUDIO_INPUT_LABELS[Number(audVal)] ?? '') : ''

				const enableVal = this.state[`Ch${ch}Enable`]
				variableObj[`Ch${ch}Enable`] = enableVal === '1' ? 'Enabled' : enableVal === '0' ? 'Disabled' : ''
				variableObj[`Ch${ch}InputFormat`] = this.state[`Ch${ch}InputFormat`] ?? ''

				const rdVal = this.state[`Ch${ch}RecordDest`]
				variableObj[`Ch${ch}RecordDest`] = rdVal ? (RECORD_DEST_LABELS[rdVal] ?? '') : ''

				const bdVal = this.state[`Ch${ch}BackupDest`]
				variableObj[`Ch${ch}BackupDest`] = bdVal ? (RECORD_DEST_LABELS[bdVal] ?? '') : ''
			}

			variableObj['StoragePath'] = this.state['StoragePath'] ?? ''
			variableObj['SWVersion'] = this.state['SWVersion'] ?? ''
			variableObj['FirmwareVersion'] = this.state['FirmwareVersion'] ?? ''
			variableObj['VolumeName'] = this.state['VolumeName'] ?? ''
			variableObj['RecordFormat'] = this.state['RecordFormat'] ?? ''
			variableObj['EncodeChannels'] = this.state['EncodeChannels'] ?? ''
			variableObj['ClipName'] = this.state['ClipName'] ?? ''
			variableObj['ClipNumber'] = this.state['ClipNumber'] ?? ''
			variableObj['Take'] = this.state['Take'] ?? ''
			variableObj['VideoEncoder'] = this.state['VideoEncoder'] ?? ''
			variableObj['FileType'] = this.state['FileType'] ?? ''

			const pbVal = this.state['PlaybackSource']
			variableObj['PlaybackSource'] = pbVal ? (RECORD_DEST_LABELS[pbVal] ?? '') : ''

			const aaVal = this.state['AnalogAudioStandard']
			variableObj['AnalogAudioStandard'] = aaVal ? (ANALOG_AUDIO_LEVEL_LABELS[Number(aaVal)] ?? '') : ''

			for (let slot = 1; slot <= 5; slot++) {
				const stateVal = this.state[`MediaSlot${slot}State`]
				variableObj[`MediaSlot${slot}State`] =
					stateVal !== '' ? (MEDIA_SLOT_STATE_LABELS[Number(stateVal)] ?? '') : ''
				const pct = this.state[`MediaSlot${slot}Percent`]
				variableObj[`MediaSlot${slot}Percent`] = pct !== '' ? pct + '%' : ''
				const cap = this.state[`MediaSlot${slot}CapacityGB`]
				variableObj[`MediaSlot${slot}CapacityGB`] = cap !== '' ? cap + ' GB' : ''
			}

			this.setVariableValues(variableObj)
		} catch (error) {
			if (this.config.verbose) {
				this.log('debug', 'Error Updating Variables: ' + error)
			}
		}
	},
}
