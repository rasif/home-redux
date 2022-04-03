import {useSelector, useDispatch} from '../libs/react-redux';

function FirstComponent() {
	const count = useSelector(store => store.counter.countFirst);
	const dispatch = useDispatch();

	const handleDispatch = () => {
		dispatch({type: 'increaseFirst'});
	};

	return (
		<>
			<p onClick={handleDispatch}>Count first: {count}</p>
		</>
	);
}

export default FirstComponent;
