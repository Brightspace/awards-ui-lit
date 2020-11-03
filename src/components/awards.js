import './awards-classlist';
import './course-awards';
import './my-awards';
import './award-icon-library';
import './available-awards';
import './award-icon-creation';
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
			},
			pageData: {
				type: Object
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
		if(this.isCourse){
			this.pageData = {detail:"org-unit-view"};
		}
		else{
			this.pageData = {detail:"org-unit-view"};
		}

		window.AwardService = AwardServiceFactory.getService();
		window.ValidationService = ValidationService;
	}

	handleNavigateEvent(e) {
		this.pageData.detail = e.detail.pageData.page;
		this.requestUpdate();
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-awards-navigate', this.handleNavigateEvent);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-awards-navigate', this.handleNavigateEvent);
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
				class='component'
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
		if (this.pageData.detail === 'org-unit-view' || this.pageData.detail === 'org-view') {
			return html`
			<d2l-tabs>
				${ this.isCourse ? this._renderCourseTabs() : html`` }
				${this._renderGeneralTabs()}
				${ !this.isCourse ? this._renderOrgTabs() : html`` }
			</d2l-tabs>
		`;
		}
		else if (this.pageData.detail === 'icon-creation-view') {
			return html`<d2l-icon-create></d2l-icon-create>`;
		}

	}
}
customElements.define('d2l-awards', Awards);
