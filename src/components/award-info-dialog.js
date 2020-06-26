import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/button/button-subtle';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { convertToDateString } from '../helpers';

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
				flex-flow: column wrap;
			}
			.flex-item {
				margin: 0.25rem;
			}
			.flex-award-image {
				align-self: center;gt
			}
		`;
	}

	constructor() {
		super();
		this.detailedAward = null;
	}

	_printHandler() {
		console.log(`TODO: Print the following award: ${JSON.stringify(this.detailedAward)}`);
	}

	_shareHandler() {
		console.log(`TODO: Share the following award on Badgr: ${JSON.stringify(this.detailedAward)}`);
	}

	_handleDialogClosed() {
		this.detailedAward = null;
	}

	_renderAwardDetails() {
		const evidence = this.detailedAward.Evidence !== undefined ? html`
			<p class='flex-item'><b>Evidence:</b> ${this.detailedAward.Evidence}</p>
		` : html``;
		const issueDate = this.detailedAward.IssueDate !== undefined ? html`
			<p class='flex-item'><b>Issue Date:</b> ${convertToDateString(this.detailedAward.IssueDate)}</p>
		` : html``;
		const printButton = this.hasPrintButton ? html`
			<d2l-button-subtle
				class='flex-item'
				text='Print'
				icon='tier1:print'
				@click='${this._printHandler}'
				>
			</d2l-button-subtle>
		` : html``;
		const shareButton = this.hasShareButton ? html`
			<d2l-button-subtle
				class='flex-item'
				text='Share on Badgr'
				icon='tier1:share'
				@click='${this._shareHandler}'
				>
			</d2l-button-subtle>
		` : html``;

		return html`
		<div class='flex-award-popup'>
			<img class='flex-award-image' src=${this.detailedAward.ImgPath} />
			<p class='flex-item'><b>Type:</b> ${this.detailedAward.Type}</p>
			<p class='flex-item'><b>Issuer:</b> ${this.detailedAward.Issuer}</p>
			<p class='flex-item'><b>Credits:</b> ${this.detailedAward.Credits}</p>
			<p class='flex-item'><b>Description:</b> ${this.detailedAward.Description}</p>
			${evidence}
			${issueDate}
			<p class='flex-item'><b>Expiration Date:</b> ${convertToDateString(this.detailedAward.ExpirationDate)}</p>
			${printButton}
			${shareButton}
		</div>
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
