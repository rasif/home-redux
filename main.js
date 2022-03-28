import store from './redux.js';

const counter = document.querySelector('.count');
const paragraph = document.querySelector('.paragraph');

const handleIncrease = () => {
	store.dispatch({type: 'increase'});
};

const listener = state => {
	counter.innerHTML = state;
};

store.subscribe(listener);

paragraph.addEventListener('click', handleIncrease);
