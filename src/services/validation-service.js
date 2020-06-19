export class ValidationService {
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
