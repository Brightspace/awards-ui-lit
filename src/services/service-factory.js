// import { AwardService } from '../services/award-service';
// import { DemoAwardService } from '../services/demo-service';
import { AwardService } from './award-service';
import { DemoAwardService } from './demo-service';

export class AwardServiceFactory {
	static getService() {
		if (window.demo) {
			return DemoAwardService;
		}
		return AwardService;
	}
}
