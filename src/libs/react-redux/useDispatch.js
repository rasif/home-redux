import {useOurContext} from './context';

function useDispatch() {
	const {dispatch} = useOurContext();

	return dispatch;
}

export default useDispatch;
