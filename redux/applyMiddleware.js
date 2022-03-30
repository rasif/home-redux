import compose from './compose.js';

function applyMiddleware(...middlewares) {
	return createStore => {
		return reducer => {
			const store = createStore(reducer);
			let dispatch = store.dispatch;

			const middlewareAPI = {
				getState: store.getState,
				dispatch: action => store.dispatch(action)
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
