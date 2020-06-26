import './awards-classlist';
import './course-awards';
import './my-awards';
import './award-icon-library';
import '@brightspace-ui/core/components/tabs/tabs';
import '@brightspace-ui/core/components/tabs/tab-panel';
import { css, html, LitElement } from 'lit-element/lit-element';
import { AwardServiceFactory } from '../services/service-factory';
import { BaseMixin } from '../mixins/base-mixin';
import { ValidationService } from '../services/validation-service';

class Awards extends BaseMixin(LitElement) {

	static get properties() {
		return {
			prop1: { type: String },
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.component {
				width: 100%
			}
		`;
	}

	constructor() {
		super();

		this.prop1 = 'awards';

		window.AwardService = AwardServiceFactory.getService();
		window.ValidationService = ValidationService;
	}

	render() {
		return html`
			<d2l-tabs>
				<d2l-tab-panel
					text="Classlist"
					>
					<d2l-awards-classlist class='component'></d2l-awards-classlist>
				</d2l-tab-panel>
				<d2l-tab-panel
					text="Course Awards"
					>
					<d2l-course-awards class='component'></d2l-course-awards>
				</d2l-tab-panel>
				<d2l-tab-panel
					text="My Awards"
					>
					<d2l-my-awards class='component'></d2l-my-awards>
				</d2l-tab-panel>
				<d2l-tab-panel
					text="Award Icon Library"
					>
					<d2l-award-icon-library class='component'></d2l-award-icon-library>
				</d2l-tab-panel>
			</d2l-tabs>
		`;
	}
}
customElements.define('d2l-awards', Awards);
