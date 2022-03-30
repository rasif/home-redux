function createStore(reducer) {
	let state = {};
	let subscribers = [];

	const getState = () => state;

	const dispatch = action => {
		state = reducer(state, action);

		subscribers.forEach(subscriber => subscriber(state));
	};

	const subscribe = listener => {
		subscribers.push(listener);
	};

	const unsubscribe = listener => {
		const index = subscribers.indexOf(listener);

		subscribers.splice(index, 1);
	};

	dispatch({});

	return {
		getState,
		dispatch,
		subscribe,
		unsubscribe
	};
}

export default createStore;
