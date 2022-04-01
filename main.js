import store from './redux.js';

const counter = document.querySelector('.count');
const paragraph = document.querySelector('.paragraph');

const handleIncreaseAsync =
	() =>
	({dispatch}) => {
		setTimeout(() => {
			dispatch({type: 'increase'});
		}, 2000);
	};

const handleIncrease = () => {
	store.dispatch(handleIncreaseAsync());
};

const listener = state => {
	counter.innerHTML = state.count;
};

store.subscribe(listener);

paragraph.addEventListener('click', handleIncrease);
