function reducer(state = 0, action) {
	if (action.type === 'increase') {
		return state + 1;
	}

	return state;
}

function createStore(reducer) {
	let state;

	const getState = () => state;

	const dispatch = action => {
		state = reducer(state, action);
	};

	dispatch({});

	return {
		getState,
		dispatch
	};
}

const store = createStore(reducer);

console.log(store.getState());

store.dispatch({type: 'increase'});
store.dispatch({type: 'increase'});
store.dispatch({type: 'increase'});

console.log(store.getState());
