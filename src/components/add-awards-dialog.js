import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/list/list';
import '@brightspace-ui/core/components/list/list-item';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';

export const awardsDialogId = 'add-award-dialog';
const DONE_ACTION = 'done';
const CANCEL_ACTION = 'cancel';

class AddAwardsDialog extends BaseMixin(LitElement) {
	static get properties() {
		return {
			availableAwards: { type: Object }
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
		this.availableAwards = [
			{
				id: '789',
				name: 'Available Award',
				imgPath: '../../images/example_award.png',
				type: 'Badge',
				credits: 5,
				hiddenUntilEarned: false,
			}
		];
	}

	async openAndGetItems() {
		const d2lDialog = this.shadowRoot.querySelector('d2l-dialog');
		const action = await d2lDialog.open();

		if (action === DONE_ACTION) {
			const d2lList = d2lDialog.querySelector('d2l-list');
			const { keys } = d2lList.getSelectionInfo();
			const awards = this.availableAwards.filter(award => keys.includes(award.id));

			return awards;
		}
		return [];
	}

	renderAward(award) {
		return html`
			<d2l-list-item key='${award.id}' selectable >
				<img src='${award.imgPath}' slot='illustration'/>
				<p>'${award.name}'</p>
			</d2l-list-item>
		`;
	}

	render() {
		return html`
		<d2l-dialog
			id='${awardsDialogId}'
			title-text='Choose Awards to Add to the Course'
		>
			<div>
				<d2l-list>
					${this.availableAwards.map(award => this.renderAward(award))}
				</d2l-list>
			</div>
			<d2l-button slot='footer' primary data-dialog-action=${DONE_ACTION}>Done</d2l-button>
			<d2l-button slot='footer' data-dialog-action=${CANCEL_ACTION}>Cancel</d2l-button>
		</d2l-dialog>
		`;
	}
}

customElements.define('d2l-add-awards-dialog', AddAwardsDialog);
