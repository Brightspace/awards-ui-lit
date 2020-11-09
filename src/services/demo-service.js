const ALL_AWARDS = 'ALL';
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
		sortFunction: (s1, s2) => s2.Awards.length - s1.Awards.length
	},
	{
		order: 'awardLeadersAscending',
		name: 'Award Leaders Ascending',
		sortFunction: (s1, s2) => s1.Awards.length - s2.Awards.length
	},
	{
		order: 'lnameAZ',
		name: 'Last Name A-Z',
		sortFunction: (s1, s2) => s1.LastName.localeCompare(s2.LastName)
	},
	{
		order: 'lnameZA',
		name: 'Last Name Z-A',
		sortFunction: (s1, s2) => s2.LastName.localeCompare(s1.LastName)
	},
	{
		order: 'fnameAZ',
		name: 'First Name A-Z',
		sortFunction: (s1, s2) => s1.FirstName.localeCompare(s2.FirstName)
	},
	{
		order: 'fnameZA',
		name: 'First Name Z-A',
		sortFunction: (s1, s2) => s2.FirstName.localeCompare(s1.FirstName)
	}
];

async function fetchData(dataPath) {
	return fetch(dataPath)
		.then(r => r.json())
		.catch(err => console.error(err));
}

function filterAwards({ awards, query = '', awardType = ALL_AWARDS }) {
	if (!awards) return;
	return awards.filter(award => {
		let matchesFilter = award.Name.toUpperCase().includes(query.toUpperCase());
		matchesFilter = matchesFilter && (awardType.toUpperCase() === ALL_AWARDS ||
			award.Type.toUpperCase() === awardType.toUpperCase());

		return matchesFilter;
	});
}

async function getFilteredAwards({ dataPath, query, awardType }) {
	if (!dataPath) return;
	const { awards } = await fetchData(dataPath);
	const filteredAwards = filterAwards({ awards, query, awardType });
	return { awards: filteredAwards };
}

export class DemoAwardService {

	static async addAwardsToOrgUnit({ awards, orgUnitId }) {
		console.log(`Received request to add to Org Unit (${orgUnitId}) the awards: ${JSON.stringify(awards)}`);
	}

	static get awardTypes() {
		return AWARD_TYPES;
	}

	static async deleteAward({ award }) {
		console.log(`Received request to delete award: ${JSON.stringify(award)}`);
	}

	static async getAssociatedAwards({ query, orgUnitId, awardType }) {
		console.log(`ASSOCIATED AWARDS: Received request with following params: [query=${query}], [orgUnitId=${orgUnitId}] [awardType=${awardType}]`);
		return getFilteredAwards({ dataPath: '../../data/associated-awards.json', query, awardType });
	}

	static async getAwards({query, awardType}) {
		console.log(`AVAILABLE AWARDS: Received request with the following params: [query=${query}], [awardType=${awardType}]`);
		return getFilteredAwards({ dataPath: '../../data/available-awards.json', query, awardType });
	}

	static async getCertificateTemplates() {
		console.log('CERTIFICATE TEMPLATES: Received request');
		return fetch('../../data/certificate-templates.json').then(r => r.json());
	}

	static async getIcons() {
		return fetch('../../data/award-icons.json').then(r => r.json());
	}

	static async getIssuedAwards({ orgUnitId, userId, query, awardType }) {
		console.log(`ISSUED AWARDS: Recived request with following params: [query=${query}], [userId=${userId}] [orgUnitId=${orgUnitId}] [awardType=${awardType}]`);
		return getFilteredAwards({ dataPath: '../../data/issued-awards.json', query, awardType });
	}

	static async getStudents({ orgUnitId, query, order }) {
		console.log(`STUDENTS: Received request with following params: [query=${query}], [orgUnitId=${orgUnitId}] [order=${order}]`);
		const { students } = await fetch('../../data/students.json').then(r => r.json());
		const filteredStudents = students.filter(student => {
			const studentName = `${student.FirstName} ${student.LastName}`;
			return studentName.includes(query);
		});
		const sortOrder = STUDENT_ORDERS.find(studentOrder => studentOrder.order === order);
		filteredStudents.sort(sortOrder.sortFunction);
		return { students: filteredStudents };
	}

	static get studentOrders() {
		return STUDENT_ORDERS.map(studentOrder => {
			return {
				order: studentOrder.order,
				name: studentOrder.name
			};
		});
	}

	static async updateAward({ award }) {
		console.log(`Received request to update award: ${JSON.stringify(award)}`);
	}
}
