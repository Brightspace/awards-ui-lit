export class DemoAwardService {
	static async addAwardsToOrgUnit({ awards, orgUnitId }) {
		console.log(`Received request to add to Org Unit (${orgUnitId}) the awards: ${JSON.stringify(awards)}`);
	}

	static async deleteAward({ award }) {
		console.log(`Received request to delete award: ${JSON.stringify(award)}`);
	}

	static async getAvailableAwards() {
		return fetch('../../data/available-awards.json').then(r => r.json());
	}

	static async getAwards({ query }) {
		if (query) console.log(`Received search query ${query}`);
		return fetch('../../data/awards.json').then(r => r.json());
	}

	static async getStudents() {
		return fetch('../../data/students.json').then(r => r.json());
	}

	static async updateAward({ award }) {
		console.log(`Received request to update award: ${JSON.stringify(award)}`);
	}
}
