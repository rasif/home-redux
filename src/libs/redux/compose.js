function compose(...funcs) {
	if (funcs.length === 0) {
		return arg => arg;
	}

	if (funcs.length === 1) {
		return funcs[0];
	}

	const lastFunction = funcs[funcs.length - 1];
	const restFunctions = funcs.slice(0, funcs.length - 1);

	return (...args) => restFunctions.reduceRight((value, nextFunction) => nextFunction(value), lastFunction(...args));
}

export default compose;
