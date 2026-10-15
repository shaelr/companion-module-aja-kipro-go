const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')

const UpgradeScripts = require('./src/upgrades')

const configFields = require('./src/configFields')
const api = require('./src/api')
const actions = require('./src/actions')
const variables = require('./src/variables')
const feedbacks = require('./src/feedbacks')
const presets = require('./src/presets')
const meters = require('./src/meters')

class AjaKiProInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...configFields,
			...api,
			...actions,
			...variables,
			...feedbacks,
			...presets,
			...meters,
		})

		this.waiting = false
		this.connectionID = 0
		this.authenticated = false
		this.authToken = ''
		this.availableClips = []

		this.state = {
			TransportState: 0,
			HDMIMonitorChannel: null,
			SDIMonitorChannel: null,
			HeadphoneMonitorChannel: null,
			VideoInput_1: null,
			VideoInput_2: null,
			VideoInput_3: null,
			VideoInput_4: null,
			AudioInput_1: null,
			AudioInput_2: null,
			AudioInput_3: null,
			AudioInput_4: null,
			StoragePath: '',
			SWVersion: '',
			RecordFormat: '',
			EncodeChannels: '',
			ClipName: '',
			ClipNumber: '',
			Take: '',
			FirmwareVersion: '',
			VolumeName: '',
			UIMonitorChannel: null,
			Ch1Enable: '',
			Ch2Enable: '',
			Ch3Enable: '',
			Ch4Enable: '',
			Ch1InputFormat: '',
			Ch2InputFormat: '',
			Ch3InputFormat: '',
			Ch4InputFormat: '',
			Ch1RecordDest: '',
			Ch2RecordDest: '',
			Ch3RecordDest: '',
			Ch4RecordDest: '',
			Ch1BackupDest: '',
			Ch2BackupDest: '',
			Ch3BackupDest: '',
			Ch4BackupDest: '',
			PlaybackSource: '',
			AnalogAudioStandard: '',
			AudioLevelL: null,
			AudioLevelR: null,
			VideoEncoder: '',
			FileType: '',
			MediaSlot1State: '',
			MediaSlot2State: '',
			MediaSlot3State: '',
			MediaSlot4State: '',
			MediaSlot5State: '',
			MediaSlot1Percent: '',
			MediaSlot2Percent: '',
			MediaSlot3Percent: '',
			MediaSlot4Percent: '',
			MediaSlot5Percent: '',
			MediaSlot1CapacityGB: '',
			MediaSlot2CapacityGB: '',
			MediaSlot3CapacityGB: '',
			MediaSlot4CapacityGB: '',
			MediaSlot5CapacityGB: '',
		}

		this.t_states = {
			UNKNOWN: 'Unknown',
			IDLE: 'Idle',
			RECORDING: 'Recording',
			FORWARD: 'Forward',
			FORWARD_2X: 'Forward 2X',
			FORWARD_4X: 'Forward 4X',
			FORWARD_8X: 'Forward 8X',
			FORWARD_16X: 'Forward 16X',
			FORWARD_32X: 'Forward 32X',
			FORWARD_STEP: 'Forward Step',
			REVERSE: 'Reverse',
			REVERSE_2X: 'Reverse 2X',
			REVERSE_4X: 'Reverse 4X',
			REVERSE_8X: 'Reverse 8X',
			REVERSE_16X: 'Reverse 16X',
			REVERSE_32X: 'Reverse 32X',
			REVERSE_STEP: 'Reverse Step',
			PAUSED: 'Paused',
			IDLE_ERROR: 'Idle Error',
			RECORD_ERROR: 'Record Error',
			PLAY_ERROR: 'Play Error',
			PAUSE_ERROR: 'Pause Error',
			SHUTDOWN: 'Shutdown',
		}
	}

	async init(config) {
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.checkVariables()
		this.checkFeedbacks()

		this.stopRequestTimer()
		this.stopConnectTimer()

		this.startConnectTimer()
		this.startMeterTimer()
		this.updateStatus(InstanceStatus.Connecting)
	}

	async destroy() {
		//close out any connections
		this.stopRequestTimer()
		this.stopConnectTimer()
		this.stopMeterTimer()

		this.debug('destroy', this.id)
	}
}

runEntrypoint(AjaKiProInstance, UpgradeScripts)
