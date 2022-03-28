# home-redux

Пишем redux с нуля

Redux - библиотека, которая позволяет нам создавать хранилище и работать с ним по определенным правилам. Эту библиотеку можно использовать не только с React, но и с другими React-подобными фреймворками и библиотеками.

Единственный способ понять, как что-то работает, - это заглянуть внутрь, посмотреть, что же там на самом деле, и попытаться реализовать самому простой вариант. Только тогда ты знаешь, как правильно и эффективно работать с этим инструментом, что я и хочу сделать в этом репозитории.

## В ветке simple-redux мы создадим примитивный Redux.

Прежде, чем приступить к начинаю изучения этой ветки, давайте посмотрим на функционал самого редакса.

Чтобы создать хранилище (store), нам нужно вызвать функцию createStore. Вызвав ее, мы получаем объект, состоящий из трех методов. Функция createStore принимает два параметра: reducer и initialState. Возвращает же: getState, dispatch и subscribe. Наша функция будет выглядеть так:

```js
function createStore(reducer, initialState) {
    ....
    ....
    ....

    return {
        getState,
        dispatch,
        subscribe
    };
}
```

Но пока что мы отбросим второй параметр функции и оставим только первый.

Что же такое "reducer"?

Reducer - функция, которая будет возвращать нам новый state, а принимать в качестве аргументов текущий state и action. Если же с текущим состоянием все понятно, что же тогда есть "action"? По сути, action - то, что позволяет нам определить, как мы должны изменить наше состояние. Это может быть и строка, и число, и еще что-то. Да можно вообще без него. Главное, чтобы в функции reducer мы могли каким-то образом понять, что мы должны сделать со state, какое новое состояние мы должны вернуть. И в редаксе принято, что action - объект, в котором есть опязательное свойство type, на которое мы и будем основываться при создании нового state.

```js
const action = {
	type: 'TYPE'
};
```

Также принято, что, если мы хотим отправить какую-то информацию в reducer, мы в качестве свойства payload объекта action можем это сделать.

Начнем с createStore.

```js
function createStore(reducer) {
	let state;

	const getState = () => state;

	const dispatch = action => {
		state = reducer(state, action);
	};

	return {
		getState,
		dispatch
	};
}
```

createStore - функция, которая в качестве параметра принимает редьюсер, то есть другую функцию, которая может менять состояние state.

Грубо говоря, reducer - это то, что меняет состояние. Не важно, что там внутри, главное, чтобы оно нам вернуло новое состояние.

Внутри createStore мы создаем две функции getState и dispatch, а затем возвращаем в виде объекта.

Эта надпись

```js
return {
	getState,
	dispatch
};
```

Аналогична этому

```js
return {
	getState: getState,
	dispatch: dispatch
};
```

Если с getState все ясно, то c dispatch могут возникнуть вопросы.

Dispatch - функция, которая вызывает reducer и сохраняет возвращаемое значение в нашем state. Но также есть и другая задача dispatch, о которой мы поговорим потом, а сейчас пока что этого достаточно.

А теперь все вместе:

```js
function reducer(state = 0, action) {
	if (action.type === 'increase') {
		return state + 1;
	}

	return state;
}

function createStore(reducer) {
	let state;

	const getState = () => state;

	const dispatch = action => {
		state = reducer(state, action);
	};

	dispatch({});

	return {
		getState,
		dispatch
	};
}

const store = createStore(reducer);

// Вызов функции getState возвращает нам текущее состояние нашего хранилища,
// а это та самая переменная state внутри createStore
console.log(store.getState());

// Отправляем действие. Под капотом будет вызываться наш reducer,
// куда мы будем передавать текущий state и action
store.dispatch({type: 'increase'});
store.dispatch({type: 'increase'});
store.dispatch({type: 'increase'});

console.log(store.getState());
```

## Переходим в ветку simple-redux-without-react

Я сказал, что можно использовать редакс везде, и я не соврал. В этой ветке мы попытаемся связать наш state manager с нативным джаваскриптом.

Мы создаем такую разметку

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Redux from scratch</title>
	</head>
	<body>
		<p class="paragraph">Counter: <span class="count">0</span></p>

		<script type="module" src="./redux.js"></script>
		<script type="module" src="./main.js"></script>
	</body>
</html>
```

В файле находим элемент по классу и выводим содержимое элемента: 0

```js
const counter = document.querySelector('.count');

console.log(counter.innerHTML);
```

Теперь мы хотим при нажатии на параграф, на элемент с классом 'paragraph' счетчик увеличивался. Увеличить счетчик мы уже умеем, достаточно отправить action в dispatch, который все за нас сделает, но как же мы узнаем, что что-то изменилось?

```js
const counter = document.querySelector('.count');
const paragraph = document.querySelector('.paragraph');

const handleIncrease = () => {
	store.dispatch({type: 'increase'});
};

paragraph.addEventListener('click', handleIncrease);
```

И здесь к нам на помощь придет функция subscribe, о которой мы говорили в самом начале.

Эта функция будет подписывать некое действие, которое будет вызвано при каждом изменении store.

По сути, эта функция будет добавлять в массив слушателей (то есть тех, кто хочет изменить что-то при изменении состояния) нового слушателя. Для этого мы в функции createStore создадим массив и добавим функцию subscribe.

```js
let subscribers = [];

const subscribe = listener => {
	subscribers.push(listener);
};
```

Отлично, теперь мы знаем, как можно добавить нового подписчика, который подслушивает изменение state хранилища. Но где эти функции-слушатели должны быть вызваны? Добавить-то добавили, надо же их как-то вызывать. А этот процесс происходит после изменения state. Где у нас происходит изменение? В dispatch. Меняем функцию dispatch и смотрим на текущее состояние нашей createStore функции.

```js
function createStore(reducer) {
	let state;
	let subscribers = [];

	const getState = () => state;

	const dispatch = action => {
		state = reducer(state, action);

		subscribers.forEach(subscriber => subscriber(state));
	};

	const subscribe = listener => {
		subscribers.push(listener);
	};

	dispatch({});

	return {
		getState,
		dispatch,
		subscribe
	};
}
```

Наш main.js файл

```js
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
```

handleIncrease - функция, которая вызывается при нажатии на paragraph и которая отправляет action в хранилище.

```js
store.subscribe(listener);
```

Здесь мы добавили нового подписчика, который меняет разметку при каждом изменении state.

А вызывали мы этого подписчика в функции dispatch:

```js
subscribers.forEach(subscriber => subscriber(state));
```

Теперь мы умеем работать с нашим state manager даже с нативным js.

## Переходим в ветку simple-redux-combine-reducers

В этой ветке мы добавим функции combineReducers и unsubscribe.

Давайте начнем с того, что узнаем, зачем эта функция вообще нужна. Если у нас будет один reducer, который будет следить за action и изменять состояние, тогда мы можем потеряться в нашем хранилище, так как кода будет очень много. И чтобы такого не было - мы должны каким-то образом разделить наше хранилище на некоторые части. К примеру, пусть будет хранилище users, который будет отвечать за пользователей, auth - который будет отвечать за авторизацию или же posts, который будет отвечать за посты. Тогда мы сможем создать такую архитектуру нашего приложения, которая позволит нам легко расширять и масштабировать его.

И здесь к нам на помощь приходит combineReducers. Эта функция, которая должна принимать все наши редьюсеры и возвращать один редьюсер, который будет видоизменять наше состояние. Давайте посмотрим на реализацию:

```js
function combineReducers(reducers) {
	return function (state, action) {
		let newState = {};

		Object.entries(reducers).forEach(([key, reducer]) => {
			newState[key] = reducer(state[key], action);
		});

		return newState;
	};
}
```

Функция, грубо говоря, возвращает нам один редьюсер, который проходится по всем нашим редьюсерам и получает от каждого новое состояние, а затем, как и обычный редьюсер, возвращает общее состояние нашему хранилищу.

```js
const rootReducer = combineReducers({count: countReducer, age: ageReducer});

const store = createStore(rootReducer);
```

Проще говоря, функция reducer в итоге сделает так:

```js
const state = {
	count: countReducer(state, action),
	age: ageReducer(state, action)
};
```

Давайте еще раз посмотрим на функцию dispatch в store.

```js
const dispatch = action => {
	state = reducer(state, action);

	subscribers.forEach(subscriber => subscriber(state));
};
```

А именно на эту строчку:

```js
state = reducer(state, action);
```

Когда мы будем использовать combineReducers, функция, вернувшаяся оттуда, будет вызвана вот именно здесь.

Теперь же возьмемся за функцию unsubscribe. Зачем она нужна? Если мы подписались на изменения, то логично, что мы должны уметь и отписаться. Ну, у нас был блок, который был подписан на изменения списка товаров, а сейчас этого блока нет, зачем же вызывать каждый раз слушателя?

Посмотрим на реализацию этой функции в createStore:

```js
const unsubscribe = listener => {
	const index = subscribers.indexOf(listener);

	subscribers.splice(index, 1);
};
```

Очень просто. Мы находим индекс этого слушателя в списке слушателей, а зачем удаляем с помощью метода массива splice.
