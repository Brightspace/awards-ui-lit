export class DemoAwardService {
	static async getAwards() {
		return fetch('../../data/awards.json');
	}
}
