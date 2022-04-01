import {createStore} from '../libs/redux';
import reducer from './reducers';

const store = createStore(reducer);

export default store;
