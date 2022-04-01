import {combineReducers} from '../../libs/redux';
import counterReducer from './counterReducer';

const reducer = combineReducers({counter: counterReducer});

export default reducer;
