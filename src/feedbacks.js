import { combineRgb } from '@companion-module/base'

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

const USB_SLOT_CHOICES = [
	{ id: '1', label: 'USB 1' },
	{ id: '2', label: 'USB 2' },
	{ id: '3', label: 'USB 3' },
	{ id: '4', label: 'USB 4' },
	{ id: '5', label: 'USB 5' },
]

const MEDIA_SLOT_STATE_CHOICES = [
	{ id: '0', label: 'Unknown' },
	{ id: '1', label: 'Mounting' },
	{ id: '2', label: 'Read-Only' },
	{ id: '3', label: 'Ready (RW)' },
	{ id: '4', label: 'Unmounting' },
	{ id: '5', label: 'Unmounted' },
	{ id: '9', label: 'Error' },
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

export default {
	initFeedbacks() {
		let self = this
		const feedbacks = {}

		const foregroundColorWhite = combineRgb(255, 255, 255)
		const foregroundColorBlack = combineRgb(0, 0, 0)
		const backgroundColorRed = combineRgb(255, 0, 0)
		const backgroundColorGreen = combineRgb(0, 255, 0)
		const backgroundColorOrange = combineRgb(255, 102, 0)
		const backgroundColorBlue = combineRgb(0, 102, 255)
		const backgroundColorYellow = combineRgb(255, 200, 0)

		feedbacks['transport_state'] = {
			type: 'boolean',
			name: 'Change colors based on transport state',
			description: 'Sets the background according to the state of the KiPro playback',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Indicate in X Status',
					id: 'state',
					default: 1,
					choices: Object.keys(this.t_states).map((i) => {
						return { id: i, label: this.t_states[i] }
					}),
				},
			],
			callback: function (feedback) {
				return self.state['TransportState'] === feedback.options.state
			},
		}

		feedbacks['media_state'] = {
			type: 'boolean',
			name: 'Change colors based on media state',
			description: 'Sets the background according to the state of the KiPro media',
			defaultStyle: {
				color: foregroundColorBlack,
				bgcolor: backgroundColorGreen,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Indicate in X Status',
					id: 'state',
					default: '0',
					choices: [
						{ id: '0', label: 'Record-Play' },
						{ id: '1', label: 'Data - LAN' },
					],
				},
			],
			callback: function (feedback) {
				return self.state['MediaState'] === feedback.options.state
			},
		}

		feedbacks['hdmi_monitor_channel'] = {
			type: 'boolean',
			name: 'HDMI monitor channel active',
			description: 'Sets the background when the selected HDMI monitor channel is active',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: '0',
					choices: MONITOR_CHANNEL_CHOICES,
				},
			],
			callback: function (feedback) {
				return self.state['HDMIMonitorChannel'] === feedback.options.channel
			},
		}

		feedbacks['sdi_monitor_channel'] = {
			type: 'boolean',
			name: 'SDI monitor channel active',
			description: 'Sets the background when the selected SDI monitor channel is active',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: '0',
					choices: MONITOR_CHANNEL_CHOICES,
				},
			],
			callback: function (feedback) {
				return self.state['SDIMonitorChannel'] === feedback.options.channel
			},
		}

		feedbacks['headphone_monitor_channel'] = {
			type: 'boolean',
			name: 'Headphone monitor channel active',
			description: 'Sets the background when the selected headphone monitor channel is active',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: '0',
					choices: HEADPHONE_CHANNEL_CHOICES,
				},
			],
			callback: function (feedback) {
				return self.state['HeadphoneMonitorChannel'] === feedback.options.channel
			},
		}

		feedbacks['ui_monitor_channel'] = {
			type: 'boolean',
			name: 'UI monitor channel active',
			description: 'Sets the background when the selected UI monitor channel is active',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: '0',
					choices: MONITOR_CHANNEL_CHOICES,
				},
			],
			callback: function (feedback) {
				return self.state['UIMonitorChannel'] === feedback.options.channel
			},
		}

		feedbacks['video_input'] = {
			type: 'boolean',
			name: 'Video input active',
			description: 'Sets the background when the selected video input is active for a channel',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
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
			callback: function (feedback) {
				return self.state[`VideoInput_${feedback.options.channel}`] === feedback.options.input
			},
		}

		feedbacks['audio_input'] = {
			type: 'boolean',
			name: 'Audio input active',
			description: 'Sets the background when the selected audio input is active for a channel',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
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
			callback: function (feedback) {
				return self.state[`AudioInput_${feedback.options.channel}`] === feedback.options.input
			},
		}

		feedbacks['media_slot_state'] = {
			type: 'boolean',
			name: 'USB slot state',
			description: 'Sets the background when the selected USB slot matches the given state',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorGreen,
			},
			options: [
				{
					type: 'dropdown',
					label: 'USB Slot',
					id: 'slot',
					default: '1',
					choices: USB_SLOT_CHOICES,
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					default: '3',
					choices: MEDIA_SLOT_STATE_CHOICES,
				},
			],
			callback: function (feedback) {
				return self.state[`MediaSlot${feedback.options.slot}State`] === feedback.options.state
			},
		}

		feedbacks['media_slot_low'] = {
			type: 'boolean',
			name: 'USB slot space low',
			description: 'Sets the background when remaining space on a USB slot is below the threshold',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorOrange,
			},
			options: [
				{
					type: 'dropdown',
					label: 'USB Slot',
					id: 'slot',
					default: '1',
					choices: USB_SLOT_CHOICES,
				},
				{
					type: 'number',
					label: 'Threshold % (warn when below)',
					id: 'threshold',
					default: 20,
					min: 1,
					max: 99,
				},
			],
			callback: function (feedback) {
				const pct = Number(self.state[`MediaSlot${feedback.options.slot}Percent`])
				return !isNaN(pct) && pct < feedback.options.threshold
			},
		}

		feedbacks['ch_enable'] = {
			type: 'boolean',
			name: 'Channel enabled',
			description: 'Sets the background when the selected channel is enabled or disabled',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorGreen,
			},
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
						{ id: '0', label: 'Disabled' },
						{ id: '1', label: 'Enabled' },
					],
				},
			],
			callback: function (feedback) {
				return self.state[`Ch${feedback.options.channel}Enable`] === feedback.options.value
			},
		}

		feedbacks['record_dest'] = {
			type: 'boolean',
			name: 'Record destination active',
			description: 'Sets the background when the selected record destination is active for a channel',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
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
			callback: function (feedback) {
				return self.state[`Ch${feedback.options.channel}RecordDest`] === feedback.options.value
			},
		}

		feedbacks['backup_dest'] = {
			type: 'boolean',
			name: 'Backup destination active',
			description: 'Sets the background when the selected backup record destination is active for a channel',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
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
			callback: function (feedback) {
				return self.state[`Ch${feedback.options.channel}BackupDest`] === feedback.options.value
			},
		}

		feedbacks['playback_source'] = {
			type: 'boolean',
			name: 'Playback source active',
			description: 'Sets the background when the selected media is the playback source',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'value',
					default: '5',
					choices: RECORD_DEST_CHOICES,
				},
			],
			callback: function (feedback) {
				return self.state['PlaybackSource'] === feedback.options.value
			},
		}

		feedbacks['analog_audio_level'] = {
			type: 'boolean',
			name: 'Analog audio input level',
			description: 'Sets the background when the analog audio input level matches',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorBlue,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Level',
					id: 'value',
					default: '0',
					choices: ANALOG_AUDIO_LEVEL_CHOICES,
				},
			],
			callback: function (feedback) {
				return self.state['AnalogAudioStandard'] === feedback.options.value
			},
		}

		feedbacks['audio_level_db'] = {
			type: 'value',
			name: 'Audio meter level (dB)',
			description:
				'The headphone channel meter level in dB, for driving gauges and expressions. -70 when silent (requires Audio Meters enabled in the module config)',
			options: [
				{
					type: 'dropdown',
					label: 'Meter',
					id: 'meter',
					default: 'L',
					choices: [
						{ id: 'L', label: 'Left' },
						{ id: 'R', label: 'Right' },
					],
				},
			],
			callback: function (feedback) {
				const level = self.state[feedback.options.meter === 'R' ? 'AudioLevelR' : 'AudioLevelL']
				return level === null || level === undefined ? -70 : level
			},
		}

		feedbacks['audio_level'] = {
			type: 'boolean',
			name: 'Audio level above threshold',
			description:
				'True when the headphone channel audio meter is above the threshold (requires Audio Meters enabled in the module config)',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Meter',
					id: 'meter',
					default: 'either',
					choices: [
						{ id: 'L', label: 'Left' },
						{ id: 'R', label: 'Right' },
						{ id: 'either', label: 'Either' },
					],
				},
				{
					type: 'number',
					label: 'Threshold (dB)',
					id: 'threshold',
					default: -2,
					min: -70,
					max: 0,
				},
			],
			callback: function (feedback) {
				const above = (level) => level !== null && level !== undefined && level >= feedback.options.threshold
				const l = self.state['AudioLevelL']
				const r = self.state['AudioLevelR']
				if (feedback.options.meter === 'L') return above(l)
				if (feedback.options.meter === 'R') return above(r)
				return above(l) || above(r)
			},
		}

		self.setFeedbackDefinitions(feedbacks)
	},
}
