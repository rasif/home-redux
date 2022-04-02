import useStore from './useStore';

function useDispatch() {
	const {dispatch} = useStore();

	return dispatch;
}

export default useDispatch;
