import isObject from './isObject';
import compareObjects from './compareObjects';

function shallowEqual(a, b) {
	if (a === b) {
		return true;
	}

	if ([a, b].some(Number.isNaN)) {
		return false;
	}

	if (![a, b].every(isObject)) {
		return false;
	}

	return compareObjects(a, b);
}

export default shallowEqual;
