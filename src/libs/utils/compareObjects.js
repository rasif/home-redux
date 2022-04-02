function compareObjects(a, b) {
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) {
		return false;
	}

	return !keysA.some(currentKey => a[currentKey] !== b[currentKey]);
}

export default compareObjects;
