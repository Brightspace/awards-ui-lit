import { AwardsService } from '../services/award-service';
import { DemoAwardsService } from '../services/demo-service';

export class AwardServiceFactory {
	static getService() {
		if (window.demo) {
			return DemoAwardsService;
		}
		return AwardsService;
	}
}
