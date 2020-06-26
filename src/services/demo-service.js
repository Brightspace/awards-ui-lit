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

	static async getAwards({ query, orgUnitId, awardType }) {
		console.log(`ASSOCIATED AWARDS: Received request with following params: [query=${query}], [orgUnitId=${orgUnitId}] [awardType=${awardType}]`);
		return fetch('../../data/awards.json').then(r => r.json());
	}

	static async getIcons() {
		return fetch('../../data/award-icons.json').then(r => r.json());
	}

	static async getIssuedAwards({ orgUnitId, userId, query, awardType }) {
		console.log(`ISSUED AWARDS: Recived request with following params: [query=${query}], [userId=${userId}] [orgUnitId=${orgUnitId}] [awardType=${awardType}]`);
		return fetch('../../data/issued-awards.json').then(r => r.json());
	}

	static async getStudents() {
		return fetch('../../data/students.json').then(r => r.json());
	}

	static async updateAward({ award }) {
		console.log(`Received request to update award: ${JSON.stringify(award)}`);
	}
}
