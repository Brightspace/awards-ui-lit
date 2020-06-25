const AWARD_TYPES = [
	{
		awardType: 'ALL',
		name: 'All Awards'
	},
	{
		awardType: 'BADGE',
		name: 'Badges'
	},
	{
		awardType: 'CERTIFICATE',
		name: 'Certificates'
	}
];
const STUDENT_ORDERS = [
	{
		order: 'awardLeadersDescending',
		name: 'Award Leaders Descending',
	},
	{
		order: 'awardLeadersAscending',
		name: 'Award Leaders Ascending',
	},
	{
		order: 'lnameAZ',
		name: 'Last Name A-Z',
	},
	{
		order: 'lnameZA',
		name: 'Last Name Z-A',
	},
	{
		order: 'fnameAZ',
		name: 'First Name A-Z',
	},
	{
		order: 'fnameZA',
		name: 'First Name Z-A',
	}
];

export class AwardService {
	static async addAwardsToOrgUnit() {
		return {};
	}

	static get awardTypes() {
		return AWARD_TYPES;
	}

	static async deleteAward() {
		return {};
	}

	static async getAssociatedAwards() {
		return {};
	}

	static async getAwards() {
		return {};
	}

	static async getIssuedAwards() {
		return {};
	}

	static async getStudents() {
		return {};
	}

	static get studentOrders() {
		return STUDENT_ORDERS;
	}

	static async updateAward() {
		return {};
	}
}
