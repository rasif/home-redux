# Redux, react-redux, redux-thunk своими руками

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

## Переходим в ветку simple-redux-finish

Чтобы не путаться в своем же коде, создадим папку для redux, куда будем класть все то, что относится к редаксу.

Теперь попробуем реализовать функцию applyMiddleware, которая будет применять наши мидлвары, то есть промежуточные звена нашего стора. Прежде, чем отправить действие диспатчом, мы создадим некий мост между отправкой и обращением к редьюсеру.

По сути, мы должны сделать каким-то образом так, чтобы dispatch был вызван только после того, как он пройдет некоторый этап, некоторый мост, который мы установим. Мы хотим, чтобы прежде, чем действие было отправлено в редьюсер, мы могли сделать что-нибудь другое, а только после этого получить новое состояние. Получается, что мы должны поменять метод dispatch, при вызове которого будут вызываться другие функции, а только затем реальный dispatch из store.

Но... здесь мы также должны будем понять, что за функция compose и что она делает.

Функция compose - функция, которая принимает в себе функции, вызывающие друг за другом. То есть:

```js
compose(A, B, C);
```

Это будет аналогично сему:

```js
A(B(C()));
```

То есть функция А кладет в качестве параметра (вызывает) функцию B, а функция B же в свою очередь функцию C.

И, чтобы не писать вот так, существует такая функция.

Посмотрим на реализацию и применение:

```js
function compose(...funcs) {
	return (...args) => funcs.reduceRight((value, currentFunction) => [currentFunction(...value)], args)[0];
}

function logOne(number) {
	console.log('log one');

	return number + 1;
}

function logTwo(number) {
	console.log('log two');

	return number + 2;
}

function logThree(number) {
	console.log('log three');

	return number + 3;
}

console.log(compose(logOne, logTwo, logThree)(0));
```

Функция compose принимает массив функций (используется rest оператор, чтобы собрать в массив) и возвращает другую функцию (для вызова полученной), которая проходится слева направо, вызывая функции друг за другом.

Но это было сделано так, чтобы не противоречить математической функции:

(𝑓∘𝑔∘ℎ)(𝑧) = 𝑓(𝑔(ℎ(𝑧)))

Да и это более понятно.

Представьте, что мы сделали бы так:

(𝑓∘𝑔∘ℎ)(𝑧) = h(g(f(𝑧)))

Как-то не то. Функция, которая работает по принципу слева направо, называется pipe.

Что такое compose - мы уже имеем представление.

Начнем реализацию applyMiddleware с того, что функция должна принимать функции (мидлвары)

```js
function applyMiddleware(...middlewares) {}
```

Функция, в свою очередь, будет возвращать функцию, которая будет принимать createStore, а эта функция будет возвращать еще одну функцию, которая будет принимать наш reducer.

```js
function applyMiddleware(...middlewares) {
	return createStore => {
		return reducer => {};
	};
}
```

Мы могли бы то же самое написать таким образом

```js
function applyMiddleware(middlewares, createStore, reducer) {}
```

Не спрашивайте пока, почему мы сделали так, это не столь принципиально в данном случае. Просто ввиду редаксовского варианта сделаем так, а в дальнейшем попытаемся понять, почему же понадобилась такая закорючка.

```js
function applyMiddleware(...middlewares) {
	return createStore => {
		return reducer => {
			const store = createStore(reducer);
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
```

Так, в первую очередь мы создаем наше хранилище, затем проходимся по всем нашим мидлварам и кладем внутрь каждого мидлвара апи getState и dispatch. Давайте посмотрим на пример кастомного мидлвара:

```js
const logger = store => next => action => {
	console.log('I AM HERE');

	next(action);
};
```

То есть после вызова мидлвара в переменной chain будет новый массив, внутри которого будет список функций. Наши мидлвары будут иметь такой вид, так как первую функцию мы уже вызвали, положив туда middlewareAPI.

```js
const logger = next => action => {
	console.log('I AM HERE');

	next(action);
};
```

Затем мы используем функцию compose, куда кладем массив chain и вызываем с параметром dispatch. Аналогично этому:

```js
dispatch = compose(firstLogger, secondLogger, thirdLogger)(store.dispatch);
```

То бишь мы хотим, чтобы был вызван сначала thirdLogger, затем secondLogger, а затем firstLogger:

```js
firstLogger(secondLogger(thirdLogger(store.dispatch)));
```

Но я немножко видоизменил функцию compose. Теперь она выглядит так:

```js
function compose(...funcs) {
	const lastFunction = funcs[funcs.length - 1];
	const restFunctions = funcs.slice(0, funcs.length - 1);

	return (...args) => restFunctions.reduceRight((value, nextFunction) => nextFunction(value), lastFunction(...args));
}
```

Все то же самое, но... Мы хотим, чтобы в следущюю функцию в качестве параметра отправлялась функция предыдущая. То есть эта часть нашего мидлвара:

```js
const logger = action => {
	console.log('I AM HERE');

	next(action);
};
```

Внутри мидлвара мы замыкнули middlewareAPI и store.dispatch. Помните да эту строчку?

```js
dispatch = compose(...chain)(store.dispatch);
```

Именно здесь мы замыкали store.dispatch, вызвав функцию compose.

```js
dispatch = compose(firstLogger, secondLogger, thirdLogger)(store.dispatch);
```

Ф-ия thirdLogger в качестве next параметра будет содержать store.dispatch.

FirstLogger в качестве next функции secondLogger, secondLogger же thirdLogger, а thirdLogger в самом конце вызовет наш реальный store.dispatch.

Вот и все.

## Переходим в ветку simple-redux-full

Здесь мы добавим некоторые проверки, перенесем вызов функции applyMiddleware внутрь createStore и создадим свой thunk middleware.

Добавили все проверки по аналогии в редаксе и вот так вот выглядит наш createStore:

```js
function createStore(reducer, preloadedState, enhancer) {
	if (
		(typeof preloadedState === 'function' && typeof enhancer === 'function') ||
		(typeof enhancer === 'function' && typeof arguments[3] === 'function')
	) {
		throw new Error('It looks like you are passing several store enhancers');
	}

	if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
		enhancer = preloadedState;
		preloadedState = undefined;
	}

	if (typeof enhancer !== 'undefined') {
		if (typeof enhancer !== 'function') {
			throw new Error('Expected enahcer to be a function');
		}

		return enhancer(createStore)(reducer, preloadedState);
	}

	if (typeof reducer !== 'function') {
		throw new Error('Expected the root reducer to be a function');
	}

	let currentReducer = reducer;
	let currentState = preloadedState;
	let currentListeners = [];
	let isDispatching = false;

	const getState = () => {
		if (isDispatching) {
			throw new Error('You may not call store.getState() while the reducer is executing');
		}

		return currentState;
	};

	const dispatch = action => {
		if (typeof action.type === 'undefined') {
			throw new Error('Actions may not have an undefined "type" property');
		}

		if (isDispatching) {
			throw new Error('Reducers may not dispatch actions.');
		}

		try {
			isDispatching = true;
			currentState = currentReducer(currentState, action);
		} finally {
			isDispatching = false;
		}

		currentListeners.forEach(listener => listener(currentState));

		return action;
	};

	const subscribe = listener => {
		if (typeof listener !== 'function') {
			throw new Error('Expected the listener to be a function');
		}

		if (isDispatching) {
			throw new Error('You may not call store.subscribe() while the reducer is executing');
		}

		let isSubscribed = true;

		currentListeners.push(listener);

		listener(currentState);

		return {
			unsubscribe() {
				if (!isSubscribed) {
					return;
				}

				if (isDispatching) {
					throw new Error('You may not unsubscribe while the reducer is executing');
				}

				isSubscribed = false;

				const index = currentListeners.indexOf(listener);

				currentListeners.splice(index, 1);
			}
		};
	};

	dispatch({type: ''});

	return {
		getState,
		dispatch,
		subscribe
	};
}
```

Да, довольно много проверок получилось. А что поделать, если мы хотим, чтобы наша библиотека работала правильно.

Так будет выглядеть наша функция compose:

```js
function compose(...funcs) {
	if (funcs.length === 0) {
		return arg => arg;
	}

	if (funcs.length === 1) {
		return funcs[0];
	}

	const lastFunction = funcs[funcs.length - 1];
	const restFunctions = funcs.slice(0, funcs.length - 1);

	return (...args) => restFunctions.reduceRight((value, nextFunction) => nextFunction(value), lastFunction(...args));
}
```

Если мидлваров нет, то просто вернуть функцию, возвращающая аргумент. Вызов этой функции в нашем случае вернет dispatch.

А если есть только один мидлвар, то вернуть этот мидлвар, который внутрь себя прокинет dispatch, как следующее действие.

Мы уже умеем создавать свои мидлвары. Создадим также свой thunk

```js
function thunk(store) {
	return next => action => {
		if (typeof action === 'function') {
			return action(store);
		}

		return next(action);
	};
}

export default thunk;
```

Что делает thunk? Смотрит на action, если это функция, то вызывает эту функцию с параметром store, а если нет, то вызывает следующий мидлвар.

Если мы диспатчим функцию, а не объект с типом type, то будет вызвана эта функция, но не реальный диспатч в редьюсер.

## Переходим в ветку react-redux

Мы знаем, что из себя представляет redux, какое api есть, как работают функции createStore, applyMiddleware, что есть на самом деле reducer, научились создавать свои мидлвары, знаем, как привязать наш store к нативному js, но как же сделать связку с React?

В этой ветке рассмотрим основные возможности react-redux, что такое Provider, как работает изнутри connect и многое другое.

Начнем, пожалуй, с самого основного, что есть в этой библиотеке. Мы создали наш store с помощью createStore, но что дальше? Как начать использовать наше хранилище? Здесь к нам приходит компонент Provider.

Он должен будет обернуть всех детей в ContextProvider и дать доступ к store всем children.

```js
import {createContext} from 'react';

const Context = createContext();

function Provider({children, store}) {
	if (!store) {
		throw new Error('Expected store');
	}

	return <Context.Provider value={store}>{children}</Context.Provider>;
}
```

Создаем контекст. Создаем компонент Provider, который делает проверку на наличие пропса store. Если все окей, то возвращаем Provider нашего контекста, а внутри children, то есть то, что обернуто в наш компонент. Теперь все, что внутри этого провайдера, сможет обратиться к нашему store.

Возьмемся за такие хуки, как useDispatch, useStore, useSelector.

Начнем с useDispatch. Данный хук должен нам возвращать dispatch нашего store.

Вот как выглядит наш хук:

```js
import {useOurContext} from './context';

function useDispatch() {
	const {dispatch} = useOurContext();

	return dispatch;
}

export default useDispatch;
```

useOurContext в свою очередь просто использует useContext, получает весь стор, но чтобы каждый раз не делать проверок да и не вызывать этот хук - мы создали свой кастомный, который все это сделает.

```js
export const useOurContext = () => {
	const value = useContext(Context);

	if (!value) {
		throw new Error('You can not use store outsider Provider');
	}

	return value;
};
```

Перейдем к хуку useStore. Что он делает? Возвращает нам store. Смотрим:

```js
import {useOurContext} from './context';

function useStore() {
	const store = useOurContext();

	return store;
}

export default useStore;
```

Вот так вот просто :)

Осталось реализовать последний хук в этой ветке: useSelector.

Основную работу выполняет именно данный хук. Он должен будет подписаться к стору и обновлять компонент при случае изменений в store. Принимает же в качестве параметра функцию селектор, возвращающая значение из store.

```js
import {useOurContext} from './context';
import {useEffect, useState} from 'react';

function useSelector(selector) {
	const [value, setValue] = useState();

	const store = useOurContext();

	useEffect(() => {
		const unsubscribe = store.subscribe(newValue => {
			setValue(newValue);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return selector(store.getState());
}

export default useSelector;
```

Что же мы делаем?

Во-первых, берем наш store из контекста. В useEffect (при монтировании компонента) подписываемся на изменения в store. Как образом? Каждый раз, когда обновится состояние нашего хранилища, то бишь, каждый раз, когда будет отправлено действие (dispatch), будут вызваны все подписчики, слушатели.

```js
const unsubscribe = store.subscribe(newValue => {
	setValue(newValue);
});
```

А возвращать этот хук будет вызов функции (селектора) с одним параметром state (store.getState).

## Переходим в ветку react-redux-connect

Те, кто работал с redux еще до появления хуков в реакте, помнят, что были такие функции, как connect, mapStateToProps, mapDispatchToProps. Рассмотрим их, посмотрим, что же они из себя представляют и как они в действительности работали под капотом.

Функция connect нужна была для того, чтобы дать доступ к хранилищу нашему компоненту. А чтобы дать доступ, мы должны были вызвать функцию с двумя параметрами mapStateToProps и mapDispatchToProps, а затем еще раз вызвать - дабы прокинуть внутрь наш компонент.

```js
import React from 'react';
import {Consumer} from './context';

function connect(mapStateToProps, mapDispatchToProps) {
	return Component => {
		class ConnectedComponent extends React.Component {
			constructor(props) {
				super(props);

				this.state = {};
			}

			componentDidMount() {
				this.props.store.subscribe(store => {
					this.setState({store});
				});
			}

			render() {
				const stateToProps =
					typeof mapStateToProps === 'function' ? mapStateToProps(this.props.store.getState()) : {};
				const dispatchToProps =
					typeof mapDispatchToProps === 'function' ? mapDispatchToProps(this.props.store.dispatch) : {};

				return <Component {...this.props} {...stateToProps} {...dispatchToProps} />;
			}
		}

		return props => <Consumer>{store => <ConnectedComponent {...props} store={store} />}</Consumer>;
	};
}

export default connect;
```

Connect - функция, которая принимает два параметра и возвращает другую функцию, которая принимает наш компонент, и затем возвращает новый компонент, куда прокидывается store через Context.Consumer, и там же мы делаем подписку на изменения в store, и вызываем те самые две функции mapStateToProps и mapDispatchToProps. Функция mapStateToProps принимает в качестве параметра состояние нашего хранилища, а возвращает объект, в котором мы получаем только то, что мы хотим. Почему именно объект? Чтобы делать деструктуризацию объекта в props нашего компонента. То же самое можно сказать про mapDispatchToProps, только здесь в качестве первого параметра прокидываем функцию dispatch. И не забываем делать проверки на то, что mapStateToProps и mapDispatchToProps - функции, чтобы мы могли их вызвать. По хорошему надо еще проверять, что возвращаемое значение это чистый объект, но не будем.

Да, нужно также отметить, что при любом изменении в store наш компонент, даже если не обращался к какому-то свойству, но уже был связан, будет обновляться. Для того, чтобы такое предовратить, нужны определенные проверки.

Смотрим на рабочий пример:

```js
import connect from './libs/react-redux/connect';

function App({count, increase}) {
	return (
		<>
			<p onClick={increase}>Count: {count}</p>
		</>
	);
}

function mapStateToProps(state) {
	return {
		count: state.counter.count
	};
}

function mapStateToDispatch(dispatch) {
	return {
		increase: () => dispatch({type: 'increase'})
	};
}

export default connect(mapStateToProps, mapStateToDispatch)(App);
```

## Переходим в ветку react-redux-finish

В этой ветке добавим еще несколько проверок. Так как наш action должен быть чистым объектом (POJO - plain old javascript object), мы напишем функцию isPlainObject, которая будет проверять сие соответствие.

Что же является чистым объектом?

Любой объект, который создан с помощью фигурный скобок или же конструктора Object():

Plain object:

```js
const object = {};

const object = {
	name: 'Name'
};

const object = new Object();
```

Не plain object:

```js
function Person() {}

const person = new Person();
```

```js
function isPlainObject(object) {
	if (typeof object !== 'object' && object === null) {
		return false;
	}

	let proto = Object.getPrototypeOf(object);

	if (proto === null) {
		return true;
	}

	let baseProto = proto;

	while (Object.getPrototypeOf(baseProto) !== null) {
		baseProto = Object.getPrototypeOf(baseProto);
	}

	return proto === baseProto;
}
```

Если тип нашего объекта не object, он не может быть чистым объектом, и если объект равен нулю, то то же самое (так как тип null в js это object). Дальше берем прототип объекта, если он равен нулю, то это чистый объект. Почему? Потому что мы можем создать объект без прототипа, и тогда он тоже будет чистым. С помощью Object.create, установив прототип в нуль. Вот пример:

```js
const obj = Object.create(null);
```

Дальше, пока наш прототип не равен нулю, мы берем прототип. И в самом конце, если наш первый прототип не равен последнему - значит, это нечистый объект.

Функция isObject, проверяющая является ли значение объектом

```js
function isObject(value) {
	return typeof value === 'object' && value !== null;
}
```

Функция shallowEqual, которая поверхностно сравнивает два значения.

Если это объект, то он проходится по всем ключам и делает строгое сравнение.

```js
import isObject from './isObject';

function shallowEqual(a, b) {
	if (a === b) {
		return true;
	}

	if ([a, b].some(Number.isNaN)) {
		return false;
	}

	if (![a, b].every(isObject)) {
		return false;
	}

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) {
		return false;
	}

	return !keysA.some(currentKey => a[currentKey] !== b[currentKey]);
}
```

-   Если это примитивные значения и они равны - вернет true.
-   Если одно из значений NaN - вернет false.
-   Если значения не объекты - вернет false, так как если они примитивные, то проверку такую мы уже сделали.
-   Затем берем ключи, длины ключей, сравниваем длины. Если длины отличаются, следовательно, они не могут быть равны.
-   В самом конце делаем проверку на то, что хотя бы одно значение не равно.

## Переходим в ветку redux-master

Если мы обратим внимание, то у нас в useSelector текущий state обновляется при каждом изменении store, при любом обращении к reducer, то есть при любом использовании метода dispatch нашего store. Чтобы предовратить это, мы должны будем проверить предыдущее значение с новым пришедшим.

```js
function useSelector(selector) {
	if (typeof selector !== 'function') {
		throw new Error('Selector can not be empty');
	}

	const store = useStore();

	const [value, setValue] = useState(() => selector(store.getState()));

	const previousValue = useRef(value);

	useEffect(() => {
		const unsubscribe = store.subscribe(newState => {
			const newValue = selector(newState);

			if (previousValue.current !== newValue) {
				setValue(newValue);
			}

			previousValue.current = newValue;
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return value;
}
```

Но также мы не должны забывать про второй параметр useSelector. Это функция сравнения (equalityFn). По умолчанию, как мы можем заметить в нашем коде, useSelector делает строгое и ссылочное сравнение. К примеру, если есть объект, а мы получаем новый объект, то state точно обновится. А примитивные значения сравниваются по значению. Давайте реализуем возможность передачи второго параметра. Вот как теперь выглядит useEffect в useSelector:

```js
useEffect(() => {
	const unsubscribe = store.subscribe(newState => {
		const newValue = selector(newState);

		if (typeof equalityFunction === 'function') {
			if (equalityFunction(newValue, previousValue.current)) {
				setValue(newValue);
			}
		} else if (previousValue.current !== newValue) {
			setValue(newValue);
		}

		previousValue.current = newValue;
	});

	return () => {
		unsubscribe();
	};
}, []);
```

Поверхностное сравнение у нас реализовано. Создадим хук, который будет его использовать.

```js
function useShallowEqualSelector(selector) {
	return useSelector(selector, shallowEqual);
}
```

Вместо useSelector, если мы хотим, чтобы наш объект сравнивался не по ссылке, а поверхностно, можем использовать данный хук.

Теперь то же самое, но с глубоким сравнением (deep equal). Для начала создадим самое сравнение.

```js
function deepEqual(a, b) {
	if (a === b) {
		return true;
	}

	if ([a, b].some(Number.isNaN)) {
		return false;
	}

	if (![a, b].every(isObject)) {
		return false;
	}

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (let currentKey of keysA) {
		if (isObject(a[currentKey])) {
			if (!deepEqual(a[currentKey], b[currentKey])) {
				return false;
			}
		} else if (a[currentKey] !== b[currentKey]) {
			return false;
		}
	}

	return true;
}
```

Почти все так же что и в shallowEqual, но с одним отличием: если перед нами объект, то мы для него также вызываем функцию deepEqual.

А вот и наш хук useDeepEqualSelector:

```js
function useDeepEqualSelector(selector) {
	return useSelector(selector, deepEqual);
}
```

## Переходим в ветку simple-reselect

Наверняка, если вы использовали redux, вы также слышали о такой библиотеке как reselect. А нужна она для того, чтобы можно было бы мемоизировать некоторое значение на основе других значений. Если у нас есть A и B, а мы должны получить на основе них C, то С изменится только в том случае, если изменится хотя бы одно из значений A и B. А зачем нам тогда вычислять C, если A и B остались неизменными? И вот тут приходит к нам на помощь такая функция createSelector. Давайте попробуем создать примитивную версию этой функции. Под капотом у них, конечно же, все иначе, используется мемоизация, но у меня нет цели переписать все так, как есть. Цель - понять.

Посмотрим на пример использования:

```js
function selectA = state => state.A;
function selectB = state => state.B;
function selectC = createSelector(selectA, selectB, (a, b) => a + b);
```

Наша функция будет принимать максимальное количество функции (input functions), а последняя функция (output function) будет собирать все значения в качестве аргумента и выдавать уже конечный резульат.

```js
function createSelector(...funcs) {
	if (funcs.length < 2) {
		throw new Error('There has to be at least one input and one output functions');
	}

	const memoizedValues = {};
	let lastResult;

	const resultFunc = funcs.pop();

	if (typeof resultFunc !== 'function') {
		throw new Error('CreateSelector expects an output function after the inputs');
	}

	return state => {
		let isChanged = false;

		for (let selector of funcs) {
			const value = selector(state);

			if (memoizedValues[selector.name] !== value) {
				memoizedValues[selector.name] = value;
				isChanged = true;
			}
		}

		if (isChanged) {
			lastResult = resultFunc(...Object.values(memoizedValues));
		}

		return lastResult;
	};
}
```

Что мы сделали?

-   проверяем, чтобы функций было хотя бы 2
-   затем забираем последнюю функцию, она у нас будет результативной
-   и возвращаем функцию селектор, которая проходится по всем input функциям и проверяет, изменилось ли значение
-   если изменилось, то вызывает последнюю функцию (output function) и прокидывает туда все значения, которые были получены из input functions
-   если же не изменилось, то возвращает предыдущее значение
