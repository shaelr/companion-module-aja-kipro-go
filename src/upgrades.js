// Old record destination / playback source option ids (0-5) -> device enum values (5-10)
const OLD_DEST_TO_NEW = { 0: '5', 1: '6', 2: '7', 3: '8', 4: '9', 5: '10' }

// Module API 2.x passes option values to upgrade scripts as { value, isExpression }.
// Returns the plain value of an option, or undefined if it is missing or an expression.
function getOptionValue(options, key) {
	const option = options[key]
	if (option === undefined || option === null) return undefined
	if (typeof option === 'object' && 'isExpression' in option) {
		return option.isExpression ? undefined : option.value
	}
	return option
}

function setOptionValue(options, key, value) {
	const option = options[key]
	if (option !== null && typeof option === 'object' && 'isExpression' in option) {
		option.value = value
	} else {
		options[key] = value
	}
}

export default [
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
				const newValue = OLD_DEST_TO_NEW[getOptionValue(action.options, 'value')]
				if (newValue !== undefined) {
					setOptionValue(action.options, 'value', newValue)
					updatedActions.push(action)
				}
			} else if (action.actionId === 'loop') {
				const idx = getOptionValue(action.options, 'idx')
				if (idx === '0' || idx === '1') {
					setOptionValue(action.options, 'idx', idx === '0' ? '1' : '0')
					updatedActions.push(action)
				}
			}
		}

		for (const feedback of props.feedbacks) {
			if (feedback.feedbackId === 'record_dest') {
				const newValue = OLD_DEST_TO_NEW[getOptionValue(feedback.options, 'value')]
				if (newValue !== undefined) {
					setOptionValue(feedback.options, 'value', newValue)
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
