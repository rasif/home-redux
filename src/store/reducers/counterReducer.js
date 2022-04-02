const initialState = {
	count: 5
};

function counterReducer(state = initialState, action) {
	if (action.type === 'increase') {
		return {
			...state,
			count: state.count + 1
		};
	}

	return state;
}

export default counterReducer;
