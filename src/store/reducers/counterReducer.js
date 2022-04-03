const initialState = {
	countFirst: 5,
	countSecond: 10
};

function counterReducer(state = initialState, action) {
	if (action.type === 'increaseFirst') {
		return {
			...state,
			countFirst: state.countFirst + 1
		};
	} else if (action.type === 'increaseSecond') {
		return {
			...state,
			countSecond: state.countSecond + 1
		};
	}

	return state;
}

export default counterReducer;
