import compose from './compose.js';

function applyMiddleware(...middlewares) {
	return createStore => {
		return (reducer, initialState) => {
			const store = createStore(reducer, initialState);
			let dispatch = store.dispatch;

			const middlewareAPI = {
				getState: store.getState,
				dispatch: action => dispatch(action)
			};

			const chain = middlewares.map(middleware => middleware(middlewareAPI));
			dispatch = compose(...chain)(store.dispatch);

			return {
				...store,
				dispatch
			};
		};
	};
}

export default applyMiddleware;
