export class DemoAwardService {
	static async getAwards() {
		return fetch('../../data/awards.json').then(r => r.json());
	}

	static async getStudents() {
		return fetch('../../data/students.json').then(r => r.json());
	}
}
