function combineReducers(reducers, initialState = {}) {
	return function (state = initialState, action) {
		let newState = {};

		for (let [key, reducer] of Object.entries(reducers)) {
			newState[key] = reducer(state[key], action);
		}

		return newState;
	};
}

export default combineReducers;
