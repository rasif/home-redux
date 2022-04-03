import useSelector from './useSelector';
import shallowEqual from '../../utils/shallowEqual';

function useShallowEqualSelector(selector) {
	return useSelector(selector, shallowEqual);
}

export default useShallowEqualSelector;
