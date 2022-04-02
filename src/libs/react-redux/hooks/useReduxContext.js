import {useContext} from 'react';
import {Context} from '../context';

const useReduxContext = () => {
	const value = useContext(Context);

	if (!value) {
		throw new Error('You can not use store outside Provider');
	}

	return value;
};

export default useReduxContext;
