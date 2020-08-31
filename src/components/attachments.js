import './attachment-list';
import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/link/link';
import '@brightspace-ui/core/components/list/list';
import '@brightspace-ui/core/components/list/list-item';
import '@brightspace-ui-labs/file-uploader/d2l-file-uploader';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';

class Attachments extends BaseMixin(LitElement) {

	static get properties() {
		return {
			attachmentsList: {
				type: Array
			},
			currentAttachments: {
				type: Array
			},
			readOnly: {
				type: Boolean,
				value: false
			}
		};
	}

	static get styles() {
		return css`
		`;
	}

	constructor() {
		super();
		this.attachmentsList = [];
		this.currentAttachments = [];
	}

	fireAttachmentListUpdated(oldVal) {
		const event = new CustomEvent('d2l-attachments-list-updated', {
			detail: {
				attachmentsList: this.attachmentsList,
				oldVal
			}
		});
		this.dispatchEvent(event);
	}

	onDialogClosed() {
		this.currentAttachments = [];
	}

	commitCurrentFiles() {
		const oldVal = [...this.attachmentsList];
		const newFileArray = [...this.attachmentsList];
		newFileArray.push(...this.currentAttachments);
		this.attachmentsList = newFileArray;
		this.fireAttachmentListUpdated(oldVal);
	}

	newFilesAdded(evt) {
		const newFileArray = [...this.currentAttachments];
		newFileArray.push(...evt.detail.files);
		this.currentAttachments = newFileArray;
		this.updateComplete.then(() => this.shadowRoot.querySelector('#add_file_dialog').resize());
	}

	updateAttachmentList(evt) {
		const oldVal = [...this.attachmentsList];
		this.attachmentsList = [...evt.detail.attachmentsList];
		this.fireAttachmentListUpdated(oldVal);
	}

	async showFileDialog() {
		await this.shadowRoot.querySelector('#add_file_dialog').open();
	}

	render() {
		return html`
		<div>
			${this.readOnly ? html`` : html`
				<d2l-button primary id="add_file_button" @click="${this.showFileDialog}">
						Add a File
				</d2l-button>
				`}
				${this.readOnly ? html`
				<d2l-attachment-list
				.attachmentsList="${[...this.attachmentsList]}"
				@internal-attachments-list-removed="${this.updateAttachmentList}"
				readOnly>
			</d2l-attachment-list>` : html`
			<d2l-attachment-list
				.attachmentsList="${[...this.attachmentsList]}"
				@internal-attachments-list-removed="${this.updateAttachmentList}">
			</d2l-attachment-list>`}
			<d2l-dialog id="add_file_dialog" title-text="Add a File" @d2l-dialog-close="${this.onDialogClosed}">
				<div id="file_loader_wrapper">
					<d2l-labs-file-uploader id="file_loader" multiple @d2l-file-uploader-files-added="${this.newFilesAdded}">
					</d2l-labs-file-uploader>
				</div>
				<d2l-attachment-list .attachmentsList="${[...this.currentAttachments]}">
				</d2l-attachment-list>
				<d2l-button slot="footer" primary dialog-action @click="${this.commitCurrentFiles}">Add</d2l-button>
				<d2l-button slot="footer" dialog-action>Cancel</d2l-button>
			</d2l-dialog>
		</div>
		`;
	}
}
customElements.define('d2l-attachments', Attachments);