import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';

class AwardsClasslist extends BaseMixin(LitElement) {

	static get properties() {
		return {
			prop1: { type: String },
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
		`;
	}

	constructor() {
		super();

		this.prop1 = 'awards';
	}

	render() {
		return html`
		<h3>boo</h3>
		`;
	}
}
customElements.define('d2l-awards-classlist', AwardsClasslist);
