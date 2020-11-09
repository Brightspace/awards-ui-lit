import '@brightspace-ui/core/components/list/list';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';

class CertificateTemplates extends BaseMixin(LitElement) {
	static get properties() {
		return {
			certificateTemplates: {
				type: Array
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
			`
		];
	}

	constructor() {
		super();

		this.certificateTemplates = [];
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchData();
	}

	async _fetchData() {
		const { Objects: templates } = await window.AwardService.getCertificateTemplates();
		this.certificateTemplates = templates;
		console.log(`CERTIFICATE TEPMLATES: ${JSON.stringify(this.certificateTemplates)}`);
	}

	_getTemplatePreviewOnClick({ Name, Path }) {
		return () => {
			console.log(`Previewing certificate template: ${Name}`);
			window.open(Path);
		};
	}

	_getTemplateDeleteOnClick(name) {
		return () => console.log(`Deleting certificate with name ${name}`);
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
					text=${this.localize('certificate-templates-preview')}
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
		<d2l-list
			id='classlist'
			grid
			>
			${this._renderTemplateListItems()}
		</d2l-list>
		`;
	}
}

customElements.define('d2l-certificate-templates', CertificateTemplates);
