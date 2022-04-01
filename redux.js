import {createStore, combineReducers, applyMiddleware} from './redux/index.js';
import thunk from './redux-thunk/index.js';

const initialState = {
	count: 10
};

function countReducer(state = 0, action) {
	if (action.type === 'increase') {
		return state + 1;
	}

	return state;
}

const rootReducer = combineReducers({count: countReducer});

const loggerOne = store => next => action => {
	console.log('I AM FIRST');

	return next(action);
};

const loggerTwo = store => next => action => {
	console.log('I AM SECOND');

	next(action);
};

const store = createStore(rootReducer, initialState, applyMiddleware(loggerOne, loggerTwo, thunk));

export default store;
