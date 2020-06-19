export class ValidationService {
	static optionSelected(option) {
		return option && option > 0;
	}

	static stringNotEmpty(str) {
		return str && str !== '';
	}

	static validEmail(email) {
		return email && email !== '';
	}
}
