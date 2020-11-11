import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/button/button-subtle';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { convertToDateString } from '../helpers';

const DONE = 'done';
const CANCEL = 'cancel';
const CREDITS_ID = 'd2l-award-info-credits';
const CHECKBOX_ID = 'd2l-award-info-checkbox';

class AwardInfoDialog extends BaseMixin(LitElement) {
	static get properties() {
		return {
			detailedAward: {
				type: Object
			},
			hasShareButton: {
				attribute: 'has-share-button',
				type: Boolean
			},
			hasPrintButton: {
				attribute: 'has-print-button',
				type: Boolean
			},
			edit: {
				type: Boolean
			},
			submitEnabled: {
				type: Boolean
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
			.flex-award-popup {
				display: flex;
				flex-flow: column nowrap;
			}
			.flex-item {
				margin: 0.25rem;
			}
			.flex-award-image {
				align-self: center;
			}
		`;
	}

	constructor() {
		super();
		this.detailedAward = null;
		this.submitEnabled = true;
	}

	_printHandler() {
		console.log(`TODO: Print the following award: ${JSON.stringify(this.detailedAward)}`);
	}

	_shareHandler() {
		console.log(`TODO: Share the following award on Badgr: ${JSON.stringify(this.detailedAward)}`);
	}

	async _handleDialogClosed(e) {
		if (e.detail.action === DONE) {
			const creditElement = this.shadowRoot.getElementById(CREDITS_ID);
			const checkboxElement = this.shadowRoot.getElementById(CHECKBOX_ID);

			if (creditElement.validity.valid) {
				// update the award
				const award = this.detailedAward;
				award.Credits = Number(creditElement.value);
				award.HiddenUntilEarned = checkboxElement.checked;
				await window.AwardService.updateAward({ award });
			}
		}

		this.detailedAward = null;
	}

	_handleValidityChange(e) {
		this.submitEnabled = !e.target.invalid;
	}

	_renderAwardDetails() {
		const evidence = this.detailedAward.Evidence !== undefined ? html`
			<p class='flex-item'><b>${this.localize('award-info-dialog-evidence-text')}:</b> ${this.detailedAward.Evidence}</p>
		` : html``;
		const issueDate = this.detailedAward.IssueDate !== undefined ? html`
			<p class='flex-item'><b>${this.localize('award-info-dialog-issue-date-text')}:</b> ${convertToDateString(this.detailedAward.IssueDate)}</p>
		` : html``;
		const editButton = this.edit ? html`
			<d2l-button
				slot="footer"
				primary
				data-dialog-action=${DONE}
				description=${this.localize('award-info-dialog-save-button-description')}
				.disabled=${!this.submitEnabled}
				>
				${this.localize('save-action')}
			</d2l-button>
			<d2l-button
				slot="footer"
				data-dialog-action=${CANCEL}
				description=${this.localize('award-info-dialog-cancel-button-description')}
				>
				${this.localize('cancel-action')}
			</d2l-button>
		` : html``;
		const printButton = this.hasPrintButton ? html`
			<d2l-button-subtle
				class='flex-item'
				text=${this.localize('print-action')}
				icon='tier1:print'
				@click='${this._printHandler}'
				>
			</d2l-button-subtle>
		` : html``;
		const shareButton = this.hasShareButton ? html`
			<d2l-button-subtle
				class='flex-item'
				text=${this.localize('share-badgr-action')}
				icon='tier1:share'
				@click='${this._shareHandler}'
				>
			</d2l-button-subtle>
		` : html``;

		return html`
		<div class='flex-award-popup'>
			<img class='flex-award-image' src=${this.detailedAward.ImgPath} />
			<p class='flex-item'><b>${this.localize('award-info-dialog-type-text')}:</b> ${this.detailedAward.Type}</p>
			<p class='flex-item'><b>${this.localize('award-info-dialog-issuer-text')}:</b> ${this.detailedAward.Issuer}</p>
			${this.edit ? html `
				<d2l-input-text
					id=${CREDITS_ID}
					class='flex-item'
					label=${this.localize('award-info-dialog-credits-text')}
					name=${this.localize('award-info-dialog-credits-text')}
					title=${this.localize('award-info-dialog-credits-text')}
					type="string"
					value=${this.detailedAward.Credits}
					required
					min=0
					pattern="^\\d*\\.?\\d*$"
					prevent-submit
					@invalid-change=${this._handleValidityChange}
					>
				</d2l-input-text>
			` : html`
				<p class='flex-item'><b>${this.localize('award-info-dialog-credits-text')}:</b> ${this.detailedAward.Credits}</p>
			`}
			<p class='flex-item'><b>${this.localize('award-info-dialog-description-text')}:</b> ${this.detailedAward.Description}</p>
			${evidence}
			${issueDate}
			<p class='flex-item'><b>${this.localize('award-info-dialog-expiration-date-text')}:</b> ${convertToDateString(this.detailedAward.ExpirationDate)}</p>
			${this.edit ? html`
				<d2l-input-checkbox
					id=${CHECKBOX_ID}
					arai-label=${this.localize('award-info-dialog-hiddne-until-earned-text')}
					name=${this.localize('award-info-dialog-hiddne-until-earned-text')}
					value=${this.detailedAward.HiddenUntilEarned}
					.checked=${this.detailedAward.HiddenUntilEarned}
					>
					${this.localize('award-info-dialog-hiddne-until-earned-text')}
				</d2l-input-checkbox>
			` : html``}
			${printButton}
			${shareButton}
		</div>
		${editButton}
		`;
	}

	render() {
		const isOpen = this.detailedAward !== null;
		return isOpen ? html`
			<d2l-dialog
				title-text='${this.detailedAward.Name}'
				?opened=${isOpen}
				@d2l-dialog-close=${this._handleDialogClosed}
				>
				${this._renderAwardDetails()}
			</d2l-dialog>
			` : html``;
	}
}

customElements.define('d2l-award-info-dialog', AwardInfoDialog);
