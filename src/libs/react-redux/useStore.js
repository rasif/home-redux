import {useOurContext} from './context';

function useStore() {
	const store = useOurContext();

	return store;
}

export default useStore;
