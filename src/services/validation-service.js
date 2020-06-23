export class ValidationService {
	static isNonNegativeNumber(str) {
		if (!str) return false;
		const nonNegativeNumberPattern = /^(\d+)*(\.\d+)*$/;
		return nonNegativeNumberPattern.test(str);
	}

	static optionSelected(option) {
		if (!option) return false;
		return option > 0;
	}

	static stringNotEmpty(str) {
		if (!str) return false;
		return str !== '';
	}

	// TODO: actually do a proper email validation regex
	static validEmail(email) {
		if (email) return false;
		return email !== '';
	}
}
