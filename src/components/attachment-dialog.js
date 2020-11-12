import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/link/link';
import '@brightspace-ui/core/components/list/list';
import '@brightspace-ui/core/components/list/list-item';
import '@brightspace-ui-labs/file-uploader/d2l-file-uploader';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';

const CREATE_ACTION = 'Create';

class AttachmentDialog extends BaseMixin(LitElement) {

	static get properties() {
		return {
			attachment: {
				type: Object
			},
			attachmentUrl: {
				type: String
			},
			opened: {
				type: Boolean
			},
			nameValue: {
				type: String
			},
			nameLabel: {
				type: String,
				attribute: 'name-label'
			},
			namePlaceholder: {
				type: String,
				attribute: 'name-placeholder'
			},
			isValidName: {
				type: Boolean
			},
			isValidImage: {
				type: Boolean
			}
		};
	}

	static get styles() {
		return css`
			.attachment-dialog__name-input{
				margin-bottom: 60px;
			}
			.attachment-dialog__action-button {
				margin-top: 30px;
				margin-right: 18px;
			}
		`;
	}

	constructor() {
		super();
		this.attachment = null;
		this.attachmentUrl = '';
		this.nameValue = '';
		this.isValidName = true;
		this.isValidImage = false;
		this.nameValue = '';
	}

	_reset() {
		this.attachment = null;
		this.attachmentUrl = '';
		this.nameValue = '';
		this.isValidName = true;
		this.isValidImage = false;
		this.nameValue = '';
	}

	_releaseBlobUrl() {
		if (this.attachmentUrl && !window.navigator.msSaveOrOpenBlob) {
			window.URL.revokeObjectURL(this.attachmentUrl);
		}
	}

	_handleClosed(event) {
		this.opened = false;
		this._releaseBlobUrl();
		this._reset();
		if (event.detail.action === CREATE_ACTION) {
			this._fireCompletionEvent();
		}
	}

	_fireCompletionEvent() {
		const attachmentChosenEvent = new CustomEvent('d2l-attachment-created', {
			detail: {
				attachment: this.attachment,
				name: this.nameValue
			},
			bubbles: false
		});
		this.dispatchEvent(attachmentChosenEvent);
		this._reset();
	}

	_handleFileUploaded(event) {
		this.attachment = event.detail ? event.detail.files[0] : null;
		this.isValidImage = this.attachment !== null;
		this._getObjectUrl();
	}

	_getObjectUrl() {
		if (this.attachment) {
			const { name } = this.attachment;
			this.attachmentUrl = window.navigator.msSaveOrOpenBlob ?
				window.navigator.msSaveOrOpenBlob(this.attachment, name) : window.URL.createObjectURL(this.attachment);
		} else {
			this.attachmentUrl = '';
		}
	}

	_getFileSizeString(fileSize) {
		if (fileSize === 0) {
			return '(0 Bytes)';
		}

		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const decimals = 2;
		const k = 1024;
		const denomination = Math.floor(Math.log(fileSize) / Math.log(k));
		return `(${parseFloat((fileSize / Math.pow(k, denomination)).toFixed(decimals))} ${sizes[denomination]})`;
	}

	_renderWithAttachment() {
		return html`
		<p>
			<d2l-link
				target="_blank"
				href=${this.attachmentUrl}>
				${this.attachment.name}
			</d2l-link>
			<span>${this._getFileSizeString(this.attachment.size)}</span>
		</p>
		`;
	}

	_changedName(event) {
		this.nameValue = event.target.value;
		this.isValidName = window.ValidationService.stringNotEmpty(this.nameValue);
	}

	render() {
		return this.opened ?
			html`
			<d2l-dialog
				title-text=${this.title}
				?opened=${this.opened}
				@d2l-dialog-close=${this._handleClosed}
				>
				<div>
					<d2l-input-text
						class="attachment-dialog__name-input"
						label=${this.nameLabel}
						placeholder=${this.namePlaceholder}
						required
						aria-invalid=${!this.isValidName}
						@input=${this._changedName}
						@focusout=${this._changedName}
						tabindex=0
						onfocus
						>
					</d2l-input-text>
					<d2l-labs-file-uploader
						@d2l-file-uploader-files-added=${this._handleFileUploaded}
						>
					</d2l-labs-file-uploader>
					<div>
						${this.attachment ? this._renderWithAttachment() : html`<p>${this.localize('attachment-dialog-none-uploaded')}</p>`}
					</div>
					<d2l-button
						class="attachment-dialog__action-button"
						slot="footer"
						@click=${this._fireCompletionEvent}
						primary
						.disabled=${!(this.isValidImage && this.isValidName)}
						data-dialog-action=${CREATE_ACTION}
						description=${this.localize('create-action')}
						>
					${this.localize('create-action')}
					</d2l-button>
					<d2l-button
						class="attachment-dialog__action-button"
						slot="footer"
						description=${this.localize('cancel-action')}
						data-dialog-action
						>
					${this.localize('cancel-action')}
					</d2l-button>
				</div>
			</d2l-dialog>
			` : html``;
	}
}
customElements.define('d2l-attachment-dialog', AttachmentDialog);
