import {useSelector, useDispatch} from '../libs/react-redux';

function SecondComponent() {
	const count = useSelector(store => store.counter.countSecond);
	const dispatch = useDispatch();

	const handleDispatch = () => {
		dispatch({type: 'increaseSecond'});
	};

	return (
		<>
			<p onClick={handleDispatch}>Count second: {count}</p>
		</>
	);
}

export default SecondComponent;
