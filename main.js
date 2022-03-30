import store from './redux.js';

const counter = document.querySelector('.count');
const paragraph = document.querySelector('.paragraph');
const subscribeButton = document.querySelector('.subscribeButton');
const unsubscribeButton = document.querySelector('.unsubscribeButton');

const handleIncrease = () => {
	store.dispatch({type: 'increase'});
};

const listener = state => {
	counter.innerHTML = state.count;
};

const handleSubscribe = () => {
	store.subscribe(listener);
};

const handleUnsubscribe = () => {
	store.unsubscribe(listener);
};

paragraph.addEventListener('click', handleIncrease);
subscribeButton.addEventListener('click', handleSubscribe);
unsubscribeButton.addEventListener('click', handleUnsubscribe);
