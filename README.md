# home-redux

Пишем redux с нуля

Redux - библиотека, которая позволяет нам создавать хранилище и работать с ним по определенным правилам. Эту библиотеку можно использовать не только с React, но и с другими React-подобными фреймворками и библиотеками.

Единственный способ понять, как что-то работает, - это заглянуть внутрь, посмотреть, что же там на самом деле, и попытаться реализовать самому простой вариант. Только тогда ты знаешь, как правильно и эффективно работать с этим инструментом, что я и хочу сделать в этом репозитории.

В ветке simple-redux мы создадим примитивный Redux.

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

// Отправляем действие. Под капотом будет вызываться наш reducer, куда мы будем передавать текущий state и action
store.dispatch({type: 'increase'});
store.dispatch({type: 'increase'});
store.dispatch({type: 'increase'});

console.log(store.getState());
```
