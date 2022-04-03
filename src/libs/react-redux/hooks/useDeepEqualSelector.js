import useSelector from './useSelector';
import deepEqual from '../../utils/deepEqual';

function useDeepEqualSelector(selector) {
	return useSelector(selector, deepEqual);
}

export default useDeepEqualSelector;
