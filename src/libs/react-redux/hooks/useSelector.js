import {useEffect, useState, useRef} from 'react';
import useStore from './useStore';

function useSelector(selector, equalityFunction) {
	if (typeof selector !== 'function') {
		throw new Error('Selector can not be empty');
	}

	const store = useStore();

	const [value, setValue] = useState(() => selector(store.getState()));

	const previousValue = useRef(value);

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

	return value;
}

export default useSelector;
