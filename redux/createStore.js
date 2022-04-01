function createStore(reducer, preloadedState, enhancer) {
	if (
		(typeof preloadedState === 'function' && typeof enhancer === 'function') ||
		(typeof enhancer === 'function' && typeof arguments[3] === 'function')
	) {
		throw new Error('It looks like you are passing several store enhancers');
	}

	if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
		enhancer = preloadedState;
		preloadedState = undefined;
	}

	if (typeof enhancer !== 'undefined') {
		if (typeof enhancer !== 'function') {
			throw new Error('Expected enahcer to be a function');
		}

		return enhancer(createStore)(reducer, preloadedState);
	}

	if (typeof reducer !== 'function') {
		throw new Error('Expected the root reducer to be a function');
	}

	let currentReducer = reducer;
	let currentState = preloadedState;
	let currentListeners = [];
	let isDispatching = false;

	const getState = () => {
		if (isDispatching) {
			throw new Error('You may not call store.getState() while the reducer is executing');
		}

		return currentState;
	};

	const dispatch = action => {
		if (typeof action.type === 'undefined') {
			throw new Error('Actions may not have an undefined "type" property');
		}

		if (isDispatching) {
			throw new Error('Reducers may not dispatch actions.');
		}

		try {
			isDispatching = true;
			currentState = currentReducer(currentState, action);
		} finally {
			isDispatching = false;
		}

		currentListeners.forEach(listener => listener(currentState));

		return action;
	};

	const subscribe = listener => {
		if (typeof listener !== 'function') {
			throw new Error('Expected the listener to be a function');
		}

		if (isDispatching) {
			throw new Error('You may not call store.subscribe() while the reducer is executing');
		}

		let isSubscribed = true;

		currentListeners.push(listener);

		listener(currentState);

		return {
			unsubscribe() {
				if (!isSubscribed) {
					return;
				}

				if (isDispatching) {
					throw new Error('You may not unsubscribe while the reducer is executing');
				}

				isSubscribed = false;

				const index = currentListeners.indexOf(listener);

				currentListeners.splice(index, 1);
			}
		};
	};

	dispatch({type: ''});

	return {
		getState,
		dispatch,
		subscribe
	};
}

export default createStore;
