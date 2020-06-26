import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/list/list';
import '@brightspace-ui/core/components/list/list-item';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';

export const awardsDialogId = 'add-award-dialog';
const DONE_ACTION = 'done';
const CANCEL_ACTION = 'cancel';
const ORG_UNIT_ID = 1000;

class AddAwardsDialog extends BaseMixin(LitElement) {
	static get properties() {
		return {
			opened: {
				type: Boolean
			},
			availableAwards: {
				type: Array
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
		`;
	}

	constructor() {
		super();
		this.opened = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchAvailableAwards();
	}

	async _fetchAvailableAwards() {
		const params = {};
		const { awards } = await window.AwardService.getAwards(params);
		this.availableAwards = awards;
	}

	_fireCustomEvent() {
		const doneClickedEvent = new CustomEvent('d2l-add-awards-dialog-done-clicked', {
			detail: {},
			bubbles: false,
			composed: false
		});
		this.dispatchEvent(doneClickedEvent);
	}

	async _handleDialogClosed(event) {
		const { detail: { action } } = event;

		// Get the selection info and then clear the selected items
		const d2lList = this.shadowRoot.querySelector('d2l-list');
		const { keys } = d2lList.getSelectionInfo();
		const items = this.shadowRoot.querySelectorAll('d2l-list d2l-list-item');
		items.forEach(item => item.setSelected(false, true)); // selected, suppressEvent

		if (action === DONE_ACTION) {
			const awards = this.availableAwards.filter(award => keys.includes(award.Id));
			if (awards.length !== 0) {
				await window.AwardService.addAwardsToOrgUnit({ awards, orgUnitId: ORG_UNIT_ID });
				this._fireCustomEvent();
			}
		}
	}

	_renderAward(award) {
		return html`
			<d2l-list-item key='${award.Id}' selectable>
				<img src='${award.ImgPath}' slot='illustration'/>
				<p>${award.Name}</p>
			</d2l-list-item>
		`;
	}

	render() {
		return html`
		<d2l-dialog
			title-text='Choose Awards to Add to Course'
			?opened=${this.opened}
			@d2l-dialog-close=${this._handleDialogClosed}
			>
			<div>
				<d2l-list>
					${this.availableAwards.map(award => this._renderAward(award))}
				</d2l-list>
			</div>
			<d2l-button slot='footer' primary data-dialog-action=${DONE_ACTION}>Done</d2l-button>
			<d2l-button slot='footer' data-dialog-action=${CANCEL_ACTION}>Cancel</d2l-button>
		</d2l-dialog>
		`;
	}
}

customElements.define('d2l-add-awards-dialog', AddAwardsDialog);
