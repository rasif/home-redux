function countReducer(state = 0, action) {
	if (action.type === 'increase') {
		return state + 1;
	}

	return state;
}

function ageReducer(state = 0, action) {
	if (action.type === 'increase') {
		return state + 1;
	}

	return state;
}

function combineReducers(reducers) {
	return function (state, action) {
		let newState = {};

		Object.entries(reducers).forEach(([key, reducer]) => {
			newState[key] = reducer(state[key], action);
		});

		return newState;
	};
}

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

const rootReducer = combineReducers({count: countReducer, age: ageReducer});

const store = createStore(rootReducer);

export default store;
