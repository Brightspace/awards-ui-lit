import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/dialog/dialog-confirm.js';
import '@brightspace-ui/core/components/tooltip/tooltip';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui-labs/file-uploader/d2l-file-uploader';
import './attachments.js';
import './attachment-list';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { convertToDateString } from '../helpers';

const YES = 'yes';

class AwardIconLibrary extends BaseMixin(LitElement) {
	static get properties() {
		return {
			icons: {
				type: Array
			},
			iconDetails: {
				type: Object
			},
			infoDialogOpened: {
				type: Boolean
			},
			deleteOpened: {
				type: Boolean
			},
			uploadOpened: {
				type: Boolean
			},
			isValidIconName: {
				type: Boolean
			},
			isValidImage: {
				type: Boolean
			},
			attachment: {
				type: Object
			}
		};
	}

	static get styles() {
		return [
			css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-button--pad-bottom {
				padding-bottom: 12px;
			}
			.upload-dialog__d2l-button{
				padding-bottom: 12px;
				margin-top: 48px;
			}
			.icon-library {
				display: grid;
				grid-template-columns: repeat(6, 1fr);
				column-gap: 12px;
  				row-gap: 12px;
			}
			.icon-library__card {
				justify-self: center;
				display: flex;
				flex-direction: column;
				box-shadow: 0 0 3px #cccccc;
				border-radius: 3px;
				width: 100%;
				padding-top: 6px;
				padding-bottom: 6px;
			}
			.icon-library__img {
				width: 75px;
				height: 75px;
				margin: auto;
				object-fit: contain;
			}
			.icon-library__d2l-button-icon {
				margin: auto;
				margin-top: 6px;
			}
			.icon-library__button-bar{
				margin: auto;
			}

			.info-dialog__column{
				display: flex;
				flex-direction: column;
			}
			.info-dialog__img {
				align-self: center;
				padding: 20px 0px;
			}

			#icon-name-upload-tooltip {
				margin: auto;
			}

			#icon-name-upload-div {
				padding-bottom: 54px;
			}

			#icon-img-upload-div {
				padding-bottom: 36px;
			}
			`
		];
	}

	constructor() {
		super();
		this.icons = [];
		this._reset();
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchData();
	}

	async _fetchData() {
		window.AwardService.getIcons().then(data => this.icons = data.icons);
	}

	_uploadButtonClicked() {
		this.uploadOpened = true;
	}

	_renderHeader() {
		return html`
		<d2l-button
			class="d2l-button--pad-bottom"
			@click=${this._uploadButtonClicked}
			description=${this.localize('icon-library-upload-button-description')}
			primary
			aria-haspopup="true"
			>
			${this.localize('icon-library-upload-button-text')}
		</d2l-button>
		`;
	}

	_openInfoDialog(iconId) {
		return () => {
			this.iconDetails = this.icons.find(icon => icon.Id === iconId);
			this.infoDialogOpened = true;
		};
	}

	_openDeleteDialog(iconId) {
		return () => {
			this.iconDetails = this.icons.find(icon => icon.Id === iconId);
			this.deleteOpened = true;
		};
	}

	_renderIcons() {
		return html`
		<div class="icon-library">
			${this.icons.map(icon => html`
				<div id="icon-${icon.Id}" class="icon-library__card">
					<img
						class="icon-library__img"
						src=${icon.Path}
						>

					<div class="icon-library__button-bar">
						<d2l-button-icon
							class="icon-library__d2l-button-icon"
							text=${this.localize('icon-library-more-info-button-text')}
							icon="tier1:more"
							aria-haspopup="true"
							aria-label=${this.localize('icon-library-more-info-button-text')}
							@click='${this._openInfoDialog(icon.Id)}'
							>
						</d2l-button-icon>
						<d2l-button-icon
							class="icon-library__d2l-button-icon"
							text=${this.localize('icon-library-delete-button-text')}
							icon="tier1:delete"
							aria-haspopup="true"
							aria-label=${this.localize('icon-library-delete-button-label')}
							@click='${this._openDeleteDialog(icon.Id)}'
							>
						</d2l-button-icon>
					</div>
				</div>
				<d2l-tooltip for="icon-${icon.Id}" offset="10">
					${icon.Name}
				</d2l-tooltip>
			`)}
		</div>
		`;
	}

	_infoDialogClose() {
		this.infoDialogOpened = false;
	}

	_renderInfoDialog() {
		return this.infoDialogOpened ? html`
		<d2l-dialog
			title-text=${this.iconDetails.Name}
			?opened=${this.infoDialogOpened}
			@d2l-dialog-close=${this._infoDialogClose}
			>
			<div class="info-dialog__column">
				<img class="info-dialog__img" src=${this.iconDetails.Path} />
				<div><b>${this.localize('icon-library-info-name-text')}:</b> ${this.iconDetails.Name}</div>
				<div><b>${this.localize('icon-library-info-creation-date-text')}:</b> ${convertToDateString(this.iconDetails.CreatedDate)}</div>
				${this.iconDetails.UsedBy.length ? html`
				<div><b>${this.localize('icon-library-info-used-by-text')}:</b></div>
				` : html``}

				<d2l-list separators="between">
					${this.iconDetails.UsedBy.map(award => html`
					<d2l-list-item>
						${award}
					</d2l-list-item>
					`)}
				</d2l-list>
			</div>

			<d2l-button
				slot="footer"
				primary
				data-dialog-action
				>
				${this.localize('close-action')}
			</d2l-button>
		</d2l-dialog>
		` : html``;
	}

	_deleteClosed(e) {
		this.deleteOpened = false;

		if (e.detail.action === YES) {
			console.log('Deleting icon...');
		}
	}

	_renderDeleteDialog() {
		return this.deleteOpened ? html`
		<d2l-dialog-confirm
			title-text=${this.localize('icon-library-confirm-delete-title')}
			text=${this.localize('icon-library-confirm-delete-title', {name: this.iconDetails.Name})}
			?opened=${this.deleteOpened}
			@d2l-dialog-close=${this._deleteClosed}
			>
			<d2l-button
				slot="footer"
				primary
				data-dialog-action=${YES}
				>
				${this.localize('yes-action')}
			</d2l-button>
			<d2l-button
				slot="footer"
				data-dialog-action
				>
				${this.localize('no-action')}
			</d2l-button>
		</d2l-dialog-confirm>
		` : html``;
	}

	_reset() {
		this.iconDetails = null;
		this.infoDialogOpened = false;
		this.deleteOpened = false;
		this.uploadOpened = false;
	}

	_uploadDialogClose() {
		this.uploadOpened = false;

		this._reset();
	}

	_createIcon({ detail: { name, attachment } }) {
		console.log(`Creating icon with name ${name} and filename ${attachment.name}`);

		//send in image and name

		this._reset();
	}

	_changedIconName(e) {
		this.isValidIconName = window.ValidationService.stringNotEmpty(e.target.value);
	}

	_imageAdded(e) {
		console.log(e.detail);
		console.log('I bubbled');
		this.isValidImage = e.detail !== null;
		this.attachment = e.detail;
		console.log(this.attachment.href);
	}

	_handleUploadDialogClosed() {
		this.uploadOpened = false;
	}

	_renderUploadDialog() {
		console.log(`AWARD ICON LIBRARY: ${this.uploadOpened}`);
		return html`
		<d2l-attachment-dialog
			title='Upload Icon'
			name-label= 'Icon Name'
			name-placeholder='Enter the icon name'
			?opened=${this.uploadOpened}
			@d2l-dialog-close=${this._handleUploadDialogClosed}
			@d2l-attachment-created=${this._createIcon}
			>
		</d2l-attachment-dialog>`;
	}

	render() {
		return html`
		${this._renderHeader()}
		${this._renderIcons()}
		${this._renderInfoDialog()}
		${this._renderDeleteDialog()}
		${this._renderUploadDialog()}
		`;
	}
}

customElements.define('d2l-award-icon-library', AwardIconLibrary);
