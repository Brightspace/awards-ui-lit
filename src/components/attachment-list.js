import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/link/link';
import '@brightspace-ui/core/components/list/list';
import '@brightspace-ui/core/components/list/list-item';
import '@brightspace-ui-labs/file-uploader/d2l-file-uploader';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';

class AttachmentList extends BaseMixin(LitElement) {

	static get properties() {
		return {
			attachmentsList: {
				type: Array
			},
			readOnly: {
				type: Boolean,
				value: false
			},
			hostPath: {
				type: String
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
	}

	connectedCallback() {
		super.connectedCallback();
	}

	fireAttachmentListUpdated(oldVal) {
		const event = new CustomEvent('internal-attachments-list-updated', {
			detail: {
				attachmentsList: this.attachmentsList,
				oldVal
			}
		});
		this.dispatchEvent(event);
	}

	fireAttachmentListRemoved(removedItem) {
		const event = new CustomEvent('internal-attachments-list-removed', {
			detail: {
				attachmentsList: this.attachmentsList,
				removedItem: removedItem
			}
		});
		this.dispatchEvent(event);
	}

	removeFile(evt) {
		const oldVal = [...this.attachmentsList];
		const newVal = [...this.attachmentsList];
		const removedValue = this.attachmentsList[evt.target.attributes.index.value];
		newVal.splice(evt.target.attributes.index.value, 1);
		this.attachmentsList = newVal;
		this.fireAttachmentListUpdated(oldVal);
		this.fireAttachmentListRemoved(removedValue);
	}

	render() {
		return html`
			<d2l-list separators="none">
				${this.attachmentsList && this.attachmentsList.map((attachment, index) => html`
					<d2l-list-item>
						<d2l-link
							target="_self"
							.attachment="${attachment}"
							@click="${this.getAttachment}"
							href="javascript:void(0)">
							${attachment.name}
						</d2l-link>
						<span>${this.getFileSizeString(attachment.size)}</span>
						${this.readOnly ? html`` : html`
						<d2l-button-icon index="${index}" icon="tier1:close-small" @click="${this.removeFile}"></d2l-button-icon>
						`}
					</d2l-list-item>
				`)}
			</d2l-list>
		`;
	}
}
customElements.define('d2l-attachment-list', AttachmentList);
