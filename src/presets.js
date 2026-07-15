const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets() {
		let self = this

		const presets = [
			// ──────────────────────────────────────────
			// Transport Control
			// ──────────────────────────────────────────
			{
				type: 'button',
				category: 'Transport Control',
				label: 'Play',
				style: {
					text: 'Play',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [{ actionId: 'play' }],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'transport_state',
						options: { state: 'FORWARD' },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(255, 0, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'PAUSED' },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(255, 255, 0) },
					},
				],
			},
			{
				type: 'button',
				category: 'Transport Control',
				label: 'Stop',
				style: {
					text: 'Stop',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [{ actionId: 'stop' }],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'transport_state',
						options: { state: 'IDLE' },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(255, 0, 0) },
					},
				],
			},
			{
				type: 'button',
				category: 'Transport Control',
				label: 'Record',
				style: {
					text: 'Rec',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [{ actionId: 'rec' }],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'transport_state',
						options: { state: 'RECORDING' },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(255, 0, 0) },
					},
				],
			},
			{
				type: 'button',
				category: 'Transport Control',
				label: 'Next',
				style: {
					text: 'Next Clip',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [{ down: [{ actionId: 'next' }], up: [] }],
				feedbacks: [],
			},
			{
				type: 'button',
				category: 'Transport Control',
				label: 'Previous Clip',
				style: {
					text: 'Prev Clip',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [{ down: [{ actionId: 'prv' }], up: [] }],
				feedbacks: [],
			},
			{
				type: 'button',
				category: 'Transport Control',
				label: 'Fast Forward',
				style: {
					text: 'FF',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [{ down: [{ actionId: 'ff' }], up: [] }],
				feedbacks: [
					{
						feedbackId: 'transport_state',
						options: { state: 'FORWARD_2X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 51, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'FORWARD_4X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 102, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'FORWARD_8X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 153, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'FORWARD_16X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 204, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'FORWARD_32X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 255, 0) },
					},
				],
			},
			{
				type: 'button',
				category: 'Transport Control',
				label: 'Rewind',
				style: {
					text: 'Rev',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [{ down: [{ actionId: 'rev' }], up: [] }],
				feedbacks: [
					{
						feedbackId: 'transport_state',
						options: { state: 'REVERSE' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 42, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'REVERSE_2X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 84, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'REVERSE_4X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 126, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'REVERSE_8X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 168, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'REVERSE_16X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 210, 0) },
					},
					{
						feedbackId: 'transport_state',
						options: { state: 'REVERSE_32X' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 255, 0) },
					},
				],
			},
			{
				type: 'button',
				category: 'Transport Control',
				label: 'Step Forward',
				style: {
					text: 'Step Forward',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [{ down: [{ actionId: 'stepF' }], up: [] }],
				feedbacks: [
					{
						feedbackId: 'transport_state',
						options: { state: 'FORWARD_STEP' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 255, 0) },
					},
				],
			},
			{
				type: 'button',
				category: 'Transport Control',
				label: 'Step Backwards',
				style: {
					text: 'Step Back',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [{ down: [{ actionId: 'stepB' }], up: [] }],
				feedbacks: [
					{
						feedbackId: 'transport_state',
						options: { state: 'REVERSE_STEP' },
						style: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(0, 255, 0) },
					},
				],
			},

			// ──────────────────────────────────────────
			// TimeCode
			// ──────────────────────────────────────────
			{
				type: 'button',
				category: 'TimeCode',
				label: 'Full Timecode',
				style: {
					text:
						'$(' +
						this.label +
						':TC_hours):$(' +
						this.label +
						':TC_min):$(' +
						this.label +
						':TC_sec):$(' +
						this.label +
						':TC_frames)',
					size: '7',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [],
			},
			{
				type: 'button',
				category: 'TimeCode',
				label: 'Timecode Hours',
				style: {
					text: 'HOURS\\n$(' + this.label + ':TC_hours)',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [],
			},
			{
				type: 'button',
				category: 'TimeCode',
				label: 'Full Minutes',
				style: {
					text: 'MIN\\n$(' + this.label + ':TC_min)',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [],
			},
			{
				type: 'button',
				category: 'TimeCode',
				label: 'Timecode Seconds',
				style: {
					text: 'SEC\\n$(' + this.label + ':TC_sec)',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [],
			},
			{
				type: 'button',
				category: 'TimeCode',
				label: 'Timecode Frames',
				style: {
					text: 'FRAMES\\n$(' + this.label + ':TC_frames)',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [],
			},

			// ──────────────────────────────────────────
			// Format Drive (Ki Pro GO)
			// ──────────────────────────────────────────
			...[
				{ id: '1', label: 'USB 1' },
				{ id: '2', label: 'USB 2' },
				{ id: '3', label: 'USB 3' },
				{ id: '4', label: 'USB 4' },
				{ id: '5', label: 'USB 5' },
				{ id: 'All', label: 'All Drives' },
			].map(({ id, label }) => ({
				type: 'button',
				category: 'Format Drive',
				label: `Format ${label}`,
				style: {
					text: `Format\\n${label}`,
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(100, 0, 0),
				},
				steps: [
					{
						down: [{ actionId: 'formatUSB', options: { value: id } }],
						up: [],
					},
				],
				feedbacks: [],
			})),

			// ──────────────────────────────────────────
			// Storage Status (Ki Pro GO)
			// ──────────────────────────────────────────
			...[1, 2, 3, 4, 5].map((slot) => ({
				type: 'button',
				category: 'Storage Status',
				label: `USB ${slot} Status`,
				style: {
					text: `USB ${slot}\\n$(${this.label}:MediaSlot${slot}State)\\n$(${this.label}:MediaSlot${slot}Percent)`,
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [
					{
						feedbackId: 'media_slot_state',
						options: { slot: String(slot), state: '3' },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 100, 0) },
					},
					{
						feedbackId: 'media_slot_state',
						options: { slot: String(slot), state: '5' },
						style: { color: combineRgb(180, 180, 180), bgcolor: combineRgb(30, 30, 30) },
					},
					{
						feedbackId: 'media_slot_state',
						options: { slot: String(slot), state: '9' },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(200, 0, 0) },
					},
					{
						feedbackId: 'media_slot_low',
						options: { slot: String(slot), threshold: 20 },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(180, 80, 0) },
					},
				],
			})),

			// ──────────────────────────────────────────
			// Functions
			// ──────────────────────────────────────────
			{
				type: 'button',
				category: 'Functions',
				label: 'Stop and format',
				style: {
					text: 'Stop & Format',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
					relative_delay: true,
				},
				steps: [
					{
						down: [
							{ actionId: 'stop' },
							{ actionId: 'stop', delay: 500 },
							{ actionId: 'customTake', options: { idx: '0' }, delay: 200 },
							{ actionId: 'format', delay: 200 },
						],
						up: [],
					},
				],
				feedbacks: [],
			},
			{
				type: 'button',
				category: 'Functions',
				label: 'Reset Timecode and Record',
				style: {
					text: 'Reset and Record',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
					relative_delay: true,
				},
				steps: [
					{
						down: [
							{ actionId: 'setTimecode', options: { idx: '1' } },
							{ actionId: 'setTimecode', delay: 10, options: { idx: '0' } },
							{ actionId: 'rec', delay: 10 },
						],
						up: [],
					},
				],
				feedbacks: [],
			},

			// ──────────────────────────────────────────
			// HDMI Monitor (Ki Pro GO)
			// ──────────────────────────────────────────
			...['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4', 'All Channels'].map((label, idx) => ({
				type: 'button',
				category: 'HDMI Monitor',
				label: `HDMI ${label}`,
				style: {
					text: `HDMI\\n${label}`,
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [{ actionId: 'setHDMIMonitorChannel', options: { value: String(idx) } }],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'hdmi_monitor_channel',
						options: { channel: String(idx) },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 102, 255) },
					},
				],
			})),

			// ──────────────────────────────────────────
			// SDI Monitor (Ki Pro GO)
			// ──────────────────────────────────────────
			...['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4', 'All Channels'].map((label, idx) => ({
				type: 'button',
				category: 'SDI Monitor',
				label: `SDI ${label}`,
				style: {
					text: `SDI\\n${label}`,
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [{ actionId: 'setSDIMonitorChannel', options: { value: String(idx) } }],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'sdi_monitor_channel',
						options: { channel: String(idx) },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 102, 255) },
					},
				],
			})),

			// ──────────────────────────────────────────
			// Headphone Monitor (Ki Pro GO)
			// ──────────────────────────────────────────
			...['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4'].map((label, idx) => ({
				type: 'button',
				category: 'Headphone Monitor',
				label: `Headphones ${label}`,
				style: {
					text: `HP\\n${label}`,
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [{ actionId: 'setHeadphoneMonitorChannel', options: { value: String(idx) } }],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'headphone_monitor_channel',
						options: { channel: String(idx) },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 102, 255) },
					},
				],
			})),

			// ──────────────────────────────────────────
			// Video Input (Ki Pro GO) — presets for Ch 1
			// ──────────────────────────────────────────
			...['SDI 1', 'SDI 2', 'SDI 3', 'SDI 4', 'HDMI 1', 'HDMI 2', 'HDMI 3', 'HDMI 4'].map(
				(label, idx) => ({
					type: 'button',
					category: 'Video Input',
					label: `Ch 1 → ${label}`,
					style: {
						text: `Ch1\\n${label}`,
						size: 'auto',
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(0, 0, 0),
					},
					steps: [
						{
							down: [
								{
									actionId: 'setVideoInput',
									options: { channel: '1', input: String(idx) },
								},
							],
							up: [],
						},
					],
					feedbacks: [
						{
							feedbackId: 'video_input',
							options: { channel: '1', input: String(idx) },
							style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 102, 255) },
						},
					],
				})
			),

			// ──────────────────────────────────────────
			// Audio Input (Ki Pro GO) — presets for Ch 1
			// ──────────────────────────────────────────
			...['Follows Video', 'Analog'].map((label, idx) => ({
				type: 'button',
				category: 'Audio Input',
				label: `Ch 1 Audio → ${label}`,
				style: {
					text: `Ch1 Audio\\n${label}`,
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'setAudioInput',
								options: { channel: '1', input: String(idx) },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'audio_input',
						options: { channel: '1', input: String(idx) },
						style: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 102, 255) },
					},
				],
			})),
		]

		this.setPresetDefinitions(presets)
	},
}
