import '@brightspace-ui/core/components/list/list';
import './attachment-dialog';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';

class CertificateTemplates extends BaseMixin(LitElement) {
	static get properties() {
		return {
			orgUnitId: {
				attribute: 'org-unit-id',
				type: Number
			},
			certificateTemplates: {
				type: Array
			},
			uploadDialogOpened: {
				type: Boolean
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
			.cert-templates {
				display: flex;
				flex-flow: column nowrap;
			}
			.cert-templates__list-container {
				justify-self: center;
				max-width: 600px;
			}
			.cert-templates__button {
				width: 240px;
				margin-bottom: 36px;
			}
			`
		];
	}

	constructor() {
		super();

		this.certificateTemplates = [];
		this.uploadDialogOpened = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchData();
	}

	async _fetchData() {
		const { Objects: templates } = await window.AwardService.getCertificateTemplates({ orgUnitId: this.orgUnitId });
		this.certificateTemplates = templates;
	}

	_openUploadDialog() {
		this.uploadDialogOpened = true;
	}

	_getTemplatePreviewOnClick({ Path }) {
		return () => window.open(Path);
	}

	_getTemplateDeleteOnClick(name) {
		return async() => await window.AwardService.deleteCertificateTemplate({
			orgUnitId: this.orgUnitId,
			name
		});
	}

	async _createCertificateTemplate({ detail: { name, attachment }}) {
		await window.AwardService.updateCertificateTemplate({
			orgUnitId: this.orgUnitId,
			name,
			attachment
		});
	}

	_handleUploadDialogClosed() {
		this._fetchData();
		this.uploadDialogOpened = false;
	}

	_renderIndividualTemplateItem(template) {
		const { Name } = template;
		return html`
		<d2l-list-item
			aria-label=${Name}
			>
			<div>
				<p>${Name}</p>
			</div>
			<div slot='actions'>
				<d2l-button-icon
					@click=${this._getTemplatePreviewOnClick(template)}
					text="${this.localize('certificate-templates-preview')}"
					icon='tier1:preview'
					aria-label=${this.localize('certificate-template-preview')}
					>
				</d2l-button-icon>
				<d2l-button-icon
					@click=${this._getTemplateDeleteOnClick(Name)}
					text=${this.localize('certificate-templates-delete')}
					icon='tier1:delete'
					aria-label=${this.localize('certificate-templates-delete')}
					>
				</d2l-button-icon>
			</div>
		</d2l-list-item>
		`;
	}

	_renderTemplateListItems() {
		return this.certificateTemplates.map(template => this._renderIndividualTemplateItem(template));
	}

	render() {
		return html`
		<d2l-attachment-dialog
			title=${this.localize('certificate-templates-upload-title')}
			name-label=${this.localize('certificate-templates-name-label')}
			name-placeholder=${this.localize('certificate-templates-name-placeholder')}
			?opened=${this.uploadDialogOpened}
			@d2l-dialog-close=${this._handleUploadDialogClosed}
			@d2l-attachment-created=${this._createCertificateTemplate}
			infer-name-from-attachment
			>
		</d2l-attachment-dialog>
		<div class='cert-templates'>
			<d2l-button
				@click=${this._openUploadDialog}
				description=${this.localize('certificate-templates-add')}
				primary
				class='cert-templates__button'
				>
				${this.localize('certificate-templates-add')}
			</d2l-button>
			<h3>${this.localize('certificate-templates-certificates')}</h3>
			<div class='cert-templates__list-container'>
				<d2l-list
					id='classlist'
					grid
					>
					${this._renderTemplateListItems()}
				</d2l-list>
			</div>
		</div>
		`;
	}
}

customElements.define('d2l-certificate-templates', CertificateTemplates);
