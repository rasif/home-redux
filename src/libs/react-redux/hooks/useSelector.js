import {useEffect, useState} from 'react';
import useStore from './useStore';

function useSelector(selector) {
	if (typeof selector !== 'function') {
		throw new Error('Selector can not be empty');
	}

	const [value, setValue] = useState();

	const store = useStore();

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
