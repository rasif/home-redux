import ContextProvider from './context';

function Provider({children, store}) {
	if (!store) {
		throw new Error('Expected store');
	}

	return <ContextProvider value={{store}}>{children}</ContextProvider>;
}

export default Provider;
