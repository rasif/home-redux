function thunk(store) {
	return next => action => {
		if (typeof action === 'function') {
			return action(store);
		}

		return next(action);
	};
}

export default thunk;
