import {createContext, useContext} from 'react';

export const Context = createContext();

export const useOurContext = () => {
	const value = useContext(Context);

	if (!value) {
		throw new Error('You can not use store outsider Provider');
	}

	return value;
};

export default Context.Provider;
