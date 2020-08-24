import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/dialog/dialog-confirm.js';
import '@brightspace-ui/core/components/tooltip/tooltip';
import '@brightspace-ui/core/components/inputs/input-text.js';
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
			imageSelected: {
				type: String
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
			.icon-add-button {
				padding-bottom: 12px;
			}
			.grid-container {
				display: grid;
				grid-template-columns: repeat(6, 1fr);
				column-gap: 12px;
  				row-gap: 12px;
			}
			.icon-container {
				justify-self: center;
				display: flex;
				flex-direction: column;
				box-shadow: 0 0 3px #cccccc;
				border-radius: 3px;
				width: 100%;
				padding-top: 6px;
				padding-bottom: 6px;
			}
			.icon {
				width: 75px;
				height: 75px;
				margin: auto;
				object-fit: contain;
			}
			.icon-button {
				margin: auto;
				margin-top: 6px;
			}
			.icon-button-container {
				margin: auto;
			}
			.upload-button{
				padding-top: 12px;
				padding-bottom: 12px;
			}
			.info-dialog-info{
				display: flex;
				flex-direction: column;
			}
			.info-dialog-image {
				align-self: center;
			}
			`
		];
	}

	constructor() {
		super();

		this.iconDetails = null;
		this.infoDialogOpened = false;
		this.deleteOpened = false;
		this.uploadOpened = false;
		this.isValidIconName = true;
		this.isValidImage = true;
		this.imageSelected = '';
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
			class="icon-add-button"
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
		<div class="grid-container">
			${this.icons.map(icon => html`
				<div id="icon-${icon.Id}" class="icon-container">
					<img
						class="icon"
						src=${icon.Path}
						>

					<div class="icon-button-container">
						<d2l-button-icon
							class="icon-button"
							text=${this.localize('icon-library-more-info-button-text')}
							icon="tier1:more"
							aria-haspopup="true"
							aria-label=${this.localize('icon-library-more-info-button-text')}
							@click='${this._openInfoDialog(icon.Id)}'
							>
						</d2l-button-icon>
						<d2l-button-icon
							class="icon-button"
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
			<div class="info-dialog-info">
				<img class="info-dialog-image" src=${this.iconDetails.Path} />
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
		this.isValidIconName = true;
		this.isValidImage = true;
		this.imageSelected = '';
	}

	_uploadDialogClose() {
		this.uploadOpened = false;

		this._reset();
	}

	_createIcon() {
		const iconName = this.shadowRoot.getElementById('icon-name-upload').value;

		this.isValidIconName = window.ValidationService.stringNotEmpty(iconName);
		this.isValidImage = this.imageSelected.length > 0;

		if (this.isValidIconName && this.isValidImage) {
			this.uploadOpened = false;
			console.log('Creating icon...');

			this._reset();
		}
	}

	_changedIconName(e) {
		this.isValidIconName = window.ValidationService.stringNotEmpty(e.target.value);
	}

	_uploadIcon() {
		this.imageSelected = 'image.png';
		this.isValidImage = this.imageSelected.length > 0;

		this.shadowRoot.getElementById('upload-dialog').resize();
	}

	_renderUploadDialog() {
		return this.uploadOpened ? html`
		<d2l-dialog
			id="upload-dialog"
			title-text=${this.localize('icon-library-upload-button-text')}
			?opened=${this.uploadOpened}
			@d2l-dialog-close=${this._uploadDialogClose}
			>
			<d2l-input-text
				id="icon-name-upload"
				label=${this.localize('icon-library-icon-name-label')}
				placeholder=${this.localize('icon-library-icon-name-placeholder')}
				required
				aria-haspopup="true"
				aria-invalid=${!this.isValidIconName}
				@input=${this._changedIconName}
				novalidate
				>
			</d2l-input-text>
			${!this.isValidIconName ? html`
			<d2l-tooltip for="icon-name-upload" state="error" align="start" offset="10">
				${this.localize('icon-library-icon-name-tooltip')}
			</d2l-tooltip>
			` : html``}

			<d2l-button
				id="icon-image-upload"
				class="upload-button"
				@click=${this._uploadIcon}
				primary
				aria-invalid=${!this.isValidImage}
				>
				${this.localize('icon-library-dialog-upload-button-text')}
			</d2l-button>
			${this.imageSelected ? html`
			<div>
				${this.localize('icon-library-dialog-image-selected', {name: this.imageSelected})}
			</div>
			` : html`
			<div>
				${this.localize('icon-library-dialog-no-image-selected')}
			</div>
			`}
			${!this.isValidImage ? html`
			<d2l-tooltip for="icon-image-upload" state="error" align="start" offset="10">
				${this.localize('icon-library-dialog-image-selected-tooltip')}
			</d2l-tooltip>
			` : html``}

			<d2l-button
				slot="footer"
				@click=${this._createIcon}
				primary
				>
				${this.localize('create-action')}
			</d2l-button>
			<d2l-button
				slot="footer"
				data-dialog-action
				>
				${this.localize('cancel-action')}
			</d2l-button>
		</d2l-dialog>
		` : html``;
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
