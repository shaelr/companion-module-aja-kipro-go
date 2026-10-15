// Old record destination / playback source option ids (0-5) -> device enum values (5-10)
const OLD_DEST_TO_NEW = { 0: '5', 1: '6', 2: '7', 3: '8', 4: '9', 5: '10' }

module.exports = [
	function (context, props) {
		// This is a placeholder than now cannot be used/removed
		return {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},
	function (context, props) {
		// v1.0.2: record destination / playback source use the device's real enum values,
		// and Loop Play option labels were swapped (device: 0 = On, 1 = Off)
		const updatedActions = []
		const updatedFeedbacks = []

		for (const action of props.actions) {
			if (['setRecordDest', 'setBackupDest', 'setPlaybackSource'].includes(action.actionId)) {
				const newValue = OLD_DEST_TO_NEW[action.options.value]
				if (newValue !== undefined) {
					action.options.value = newValue
					updatedActions.push(action)
				}
			} else if (action.actionId === 'loop') {
				if (action.options.idx === '0' || action.options.idx === '1') {
					action.options.idx = action.options.idx === '0' ? '1' : '0'
					updatedActions.push(action)
				}
			}
		}

		for (const feedback of props.feedbacks) {
			if (feedback.feedbackId === 'record_dest') {
				const newValue = OLD_DEST_TO_NEW[feedback.options.value]
				if (newValue !== undefined) {
					feedback.options.value = newValue
					updatedFeedbacks.push(feedback)
				}
			}
		}

		return {
			updatedConfig: null,
			updatedActions,
			updatedFeedbacks,
		}
	},
]
