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
