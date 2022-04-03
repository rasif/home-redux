import isObject from './isObject';

function deepEqual(a, b) {
	if (a === b) {
		return true;
	}

	if ([a, b].some(Number.isNaN)) {
		return false;
	}

	if (![a, b].every(isObject)) {
		return false;
	}

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (let currentKey of keysA) {
		if (isObject(a[currentKey])) {
			if (!deepEqual(a[currentKey], b[currentKey])) {
				return false;
			}
		} else if (a[currentKey] !== b[currentKey]) {
			return false;
		}
	}

	return true;
}

export default deepEqual;
