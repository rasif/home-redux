function combineReducers(reducers) {
	return function (state, action) {
		let newState = {};

		Object.entries(reducers).forEach(([key, reducer]) => {
			newState[key] = reducer(state[key], action);
		});

		return newState;
	};
}

export default combineReducers;
