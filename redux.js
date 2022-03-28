function reducer(state = 0, action) {
	if (action.type === 'increase') {
		return state + 1;
	}

	return state;
}

function createStore(reducer) {
	let state;
	let subscribers = [];

	const getState = () => state;

	const dispatch = action => {
		state = reducer(state, action);

		subscribers.forEach(subscriber => subscriber(state));
	};

	const subscribe = listener => {
		subscribers.push(listener);
	};

	dispatch({});

	return {
		getState,
		dispatch,
		subscribe
	};
}

const store = createStore(reducer);

export default store;
