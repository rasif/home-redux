function isPlainObject(object) {
	if (typeof object !== 'object' && object === null) {
		return false;
	}

	let proto = Object.getPrototypeOf(object);

	if (proto === null) {
		return true;
	}

	let baseProto = proto;

	while (Object.getPrototypeOf(baseProto) !== null) {
		baseProto = Object.getPrototypeOf(baseProto);
	}

	return proto === baseProto;
}

export default isPlainObject;
