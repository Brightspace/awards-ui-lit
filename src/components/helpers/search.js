import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/inputs/input-search';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
import { isObjectEmpty } from '../../helpers';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

class Search extends BaseMixin(LitElement) {
	static get properties() {
		return {
			selectorOptions: {
				type: Array
			},
			selectorParams: {
				type: Object
			},
			searchParams: {
				type: Object
			},
			buttonParams: {
				type: Object
			}
		};
	}

	static get styles() {
		return [
			selectStyles,
			css`
			:host {
				display: inline-block;
				margin-bottom: 20px;
			}
			:host([hidden]) {
				display: none;
			}
			.header {
				display: flex;
				flex-flow: row nowrap;
				width: 100%;
			}
			.-flex-item {
				margin: 0.25rem 0 0 0.25rem;
				flex: 1;
			}
			.input-search {
				margin: 0.25rem 0.25rem 0.25rem 0;
				flex: 4;
			}
			.select{
				width: 100%;
			}
			`
		];
	}

	constructor() {
		super();
		this.selectorOptions = [];
		this.selectorParams = Object();
		this.searchParams = Object();
		this.buttonParams = Object();
	}

	connectedCallback() {
		super.connectedCallback();
	}

	_handleSearchEvent(e) {
		// This is required because the event e has already been dispatched and events can
		// only be dispatched once
		const new_event = new e.constructor(e.type, e);
		this.dispatchEvent(new_event);
	}

	_handleSelectorInput(e) {
		const { target: { value: index} } = e;
		const new_event = new CustomEvent('d2l-selector-changed', {
			detail: {
				value: index
			}
		});
		this.dispatchEvent(new_event);
	}

	_handleButtonPressed(e) {
		const new_event = new e.constructor('d2l-button-pressed', e);
		this.dispatchEvent(new_event);
	}

	_renderSearchBar() {
		return !isObjectEmpty(this.searchParams) ? html`
			<d2l-input-search
				class='input-search'
				label=${this.searchParams.label}
				aria-label=${this.searchParams.label}
				placeholder=${this.searchParams.placeholder}
				@d2l-input-search-searched=${this._handleSearchEvent}
				>
			</d2l-input-search>
		` : html``;
	}

	_renderSelector() {
		const options = this.selectorOptions.map(({name, value}) => {
			return html`<option value=${value}>${name}</option>`;
		});

		return options.length > 0 ? html `
			<select
				class='d2l-input-select -flex-item'
				aria-label=${this.selectorParams.label}
				@input='${this._handleSelectorInput}'
				>
				${options}
			</select>
		` : html``;
	}

	_renderButton() {
		return !isObjectEmpty(this.buttonParams) ? html`
			<d2l-button
				class='-flex-item'
				id=${this.buttonParams.id}
				text=${this.buttonParams.text}
				aria-label=${this.buttonParams.label}
				aria-haspopup=${this.buttonParams.haspopup}
				?primary=${this.buttonParams.primary}
				@click='${this._handleButtonPressed}'
				>
				${this.buttonParams.text}
			</d2l-button>
		` : html``;
	}

	render() {
		return html`
			<div class='header'>
				${this._renderSearchBar()}
				${this._renderSelector()}
				${this._renderButton()}
			</div>
		`;
	}
}

customElements.define('d2l-awards-search', Search);
