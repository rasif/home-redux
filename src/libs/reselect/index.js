function createSelector(...funcs) {
	if (funcs.length < 2) {
		throw new Error('There has to be at least one input and one output functions');
	}

	const memoizedValues = {};
	let lastResult;

	const resultFunc = funcs.pop();

	if (typeof resultFunc !== 'function') {
		throw new Error('CreateSelector expects an output function after the inputs');
	}

	return state => {
		let isChanged = false;

		for (let selector of funcs) {
			const value = selector(state);

			if (memoizedValues[selector.name] !== value) {
				memoizedValues[selector.name] = value;
				isChanged = true;
			}
		}

		if (isChanged) {
			lastResult = resultFunc(...Object.values(memoizedValues));
		}

		return lastResult;
	};
}

export default createSelector;
