import './awards-classlist';
import './course-awards';
import './my-awards';
import './award-icon-library';
import './available-awards';
import './attachments';
import '@brightspace-ui/core/components/tabs/tabs';
import '@brightspace-ui/core/components/tabs/tab-panel';
import { css, html, LitElement } from 'lit-element/lit-element';
import { AwardServiceFactory } from '../services/service-factory';
import { BaseMixin } from '../mixins/base-mixin';
import { ValidationService } from '../services/validation-service';
//fix redirect
//fix form validation

class IconCreation extends BaseMixin(LitElement) {

	static get properties() {
		return {
			pageData: {
				type: Object
			},
			attachments: {
				type: Array
			},
			isValidImage: {
				type: Boolean
			}
		};
	}

	static get styles() {
		return css`

		`;

	}
	
	constructor() {
		super();
		this.attachments = [];
		this.isValidImage = true;
		console.log("creating icon create");
	}

	attachmentsUpdated(event) {
		console.log(this.attachment);
		console.log(event.detail.attachmentsList)
		this.attachments = event.detail.attachmentsList;
		console.log("HERE");
	}

	render() {
		return html`
		<div>
			<d2l-input-text
				id="icon-name-upload"
				label="Icon Name"
				placeholder="Enter the icon name"
				required
				aria-haspopup="true"
				aria-invalid=${!this.isValidIconName}
				@input=${this._changedIconName}
				@focusout=${this._changedIconName}
				tabindex=0
				novalidate
				>
			</d2l-input-text>
			${!this.isValidIconName ? html`
			<d2l-tooltip for="icon-name-upload" state="error" align="start" offset="10">
				Please provide an icon name
			</d2l-tooltip>
			` : html``}
			<d2l-attachments .attachmentsList="${this.attachments}" @d2l-attachments-list-updated="${this.attachmentsUpdated}">
				<p>Attachments are here</p>
			</d2l-attachments>
			<!--<d2l-button
				id="icon-image-upload"
				class="upload-button"
				@click=${this._uploadIcon}
				@focusout=${this._uploadIcon}
				primary
				aria-invalid=${!this.isValidImage}
				tabindex=1
				>
				Upload Icon
			</d2l-button>
			
			${this.imageSelected ? html`
			<div>
				Image selected: ${this.imageSelected}
			</div>
			` : html`
			<div>
				No image selected
			</div>
			`}-->
			
			
			${!this.isValidImage ? html`
			<d2l-tooltip for="icon-image-upload" state="error" align="start" offset="10">
				Please select and image for the icon
			</d2l-tooltip>
			` : html``}

			<d2l-button
				slot="footer"
				@click=${this._createIcon}
				primary
				.disabled=${!(this.isValidImage && this.isValidIconName)}
				>
				Create
			</d2l-button>
			<d2l-button
				slot="footer"
				data-dialog-action
				>
				Cancel
			</d2l-button>
		</div>
		`;
	}

}

customElements.define('d2l-icon-create', IconCreation);