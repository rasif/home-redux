import useReduxContext from './useReduxContext';

function useStore() {
	const store = useReduxContext();

	return store;
}

export default useStore;
