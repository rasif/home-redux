import createStore from './redux/createStore.js';
import combineReducers from './redux/combineReducers.js';
import applyMiddleware from './redux/applyMiddleware.js';

function countReducer(state = 0, action) {
	if (action.type === 'increase') {
		return state + 1;
	}

	return state;
}

const rootReducer = combineReducers({count: countReducer});

const loggerOne = store => next => action => {
	console.log('I AM FIRST');

	next(action);
};

const loggerTwo = store => next => action => {
	console.log('I AM SECOND');

	next(action);
};

const store = applyMiddleware(loggerOne, loggerTwo)(createStore)(rootReducer);

export default store;
