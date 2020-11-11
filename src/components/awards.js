import './awards-classlist';
import './course-awards';
import './my-awards';
import './award-icon-library';
import './available-awards';
import '@brightspace-ui/core/components/tabs/tabs';
import '@brightspace-ui/core/components/tabs/tab-panel';
import { css, html, LitElement } from 'lit-element/lit-element';
import { AwardServiceFactory } from '../services/service-factory';
import { BaseMixin } from '../mixins/base-mixin';
import { ValidationService } from '../services/validation-service';

class Awards extends BaseMixin(LitElement) {

	static get properties() {
		return {
			isCourse: {
				attribute: 'course',
				type: Boolean
			},
			orgUnitId: {
				attribute: 'org-unit-id',
				type: Number
			}
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

	_renderCourseTabs() {
		return html`
		<d2l-tab-panel text="Classlist">
			<d2l-awards-classlist
				class='component'
				org-unit-id="${this.orgUnitId}"
				>
			</d2l-awards-classlist>
		</d2l-tab-panel>

		<d2l-tab-panel text="Course Awards">
			<d2l-course-awards
				class='codmponent'
				org-unit-id="${this.orgUnitId}"
				>
			</d2l-course-awards>
		</d2l-tab-panel>
		`;
	}

	_renderOrgTabs() {
		return html`
		<d2l-tab-panel
			text="Award Icon Library"
			>
			<d2l-award-icon-library class='component'></d2l-award-icon-library>
		</d2l-tab-panel>
		`;
	}

	_renderGeneralTabs() {
		return html`
			<d2l-tab-panel
				text="My Awards"
				>
				<d2l-my-awards
					class='component'
					org-unit-id="${this.orgUnitId}"
				>
				</d2l-my-awards>
			</d2l-tab-panel>
			<d2l-tab-panel
				text="View Available Awards"
				>
				<d2l-available-awards
					class='component'
					org-unit-id="${this.orgUnitId}"
				>
				</d2l-available-awards>
			</d2l-tab-panel>
		`;
	}

	render() {
		return html`
			<d2l-tabs>
				${ this.isCourse ? this._renderCourseTabs() : html`` }
				${this._renderGeneralTabs()}
				${ !this.isCourse ? this._renderOrgTabs() : html`` }
			</d2l-tabs>
		`;
	}
}
customElements.define('d2l-awards', Awards);
