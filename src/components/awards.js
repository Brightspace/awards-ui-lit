import './awards-classlist';
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
					<d2l-awards-classlist></d2l-awards-classlist>
				</d2l-tab-panel>
				<d2l-tab-panel
					text="My Awards"
					>
					bye
				</d2l-tab-panel>
			</d2l-tabs>
		`;
	}
}
customElements.define('d2l-awards', Awards);
