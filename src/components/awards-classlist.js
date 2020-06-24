import './awards-classlist-dialogs.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class AwardsClasslist extends BaseMixin(LitElement) {

	static get properties() {
		return {
			classlist: {
				type: Array
			},
			selectedStudents: {
				type: Array
			},
			issueDialogOpened: {
				type: Boolean
			},
			revokeDialogOpened: {
				type: Boolean
			},
			areStudentsSelected: {
				type: Boolean
			}
		};
	}

	static get styles() {
		return [
			selectStyles,
			css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.awards-classlist-search {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin: 12px;
			}
			.awards-classlist-search-input {
				flex-grow: 1;
				margin: 6px;
			}
			.awards-classlist-search-order {
				margin: 6px;
			}
		`];
	}

	constructor() {
		super();

		this.selectedStudents = Array();
		this.issueDialogOpened = false;
		this.revokeDialogOpened = false;
		this.areStudentsSelected = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchData();
	}

	async _fetchData() {
		window.AwardService.getStudents().then(data => this.classlist = data.students);
	}

	_issueDialogClosed() {
		this.issueDialogOpened = false;
	}

	_revokeDialogClosed(event) {
		this.revokeDialogOpened = false;

		if (event.detail.action === 'done') {
			console.log('Pressed Done');
		}
	}

	_renderDialogs() {
		return html`
		<d2l-awards-classlist-issue-dialog 
			?issueDialogOpened=${this.issueDialogOpened} 
			@d2l-dialog-close=${this._issueDialogClosed}
			.selectedStudents=${this.selectedStudents}
			>
		</d2l-awards-classlist-issue-dialog>
		<d2l-awards-classlist-revoke-dialog 
			?revokeDialogOpened=${this.revokeDialogOpened} 
			@d2l-dialog-close=${this._revokeDialogClosed}
			.selectedStudents=${this.selectedStudents}
			>
		</d2l-awards-classlist-revoke-dialog>
		`;
	}

	_findSelectedStudents() {
		const keys = this.shadowRoot.getElementById('classlist').getSelectionInfo().keys;

		this.selectedStudents = Array();
		for (const key of keys) {
			this.selectedStudents.push(this.classlist.find(student => student.id === key).name);
		}
	}

	_issueButtonClicked() {
		this._findSelectedStudents();

		this.issueDialogOpened = true;
	}

	_revokeButtonClicked() {
		this._findSelectedStudents();

		this.revokeDialogOpened = true;
	}

	_renderButtons() {
		return html`
		<d2l-button
			@click=${this._issueButtonClicked}
			description="Issue an award to students selected"
			primary
			aria-haspopup="true"
			?disabled=${!this.areStudentsSelected}
			>
			Issue
		</d2l-button>
		<d2l-button
			@click=${this._revokeButtonClicked}
			description="Revoke an award to students selected"
			aria-haspopup="true"
			?disabled=${!this.areStudentsSelected}
			>
			Revoke
		</d2l-button>
		`;
	}

	_updateSearch(event) {
		console.log(event);
	}

	_updateOrder(event) {
		console.log(event);
	}

	_renderSearch() {
		return html`
		<div class="awards-classlist-search">
			<d2l-input-search
				label="Search classlist"
				placeholder="Search classlist"
				@d2l-input-search-searched=${this._updateSearch}
				class="awards-classlist-search-input"
				>
			</d2l-input-search>
			<select 
				class="d2l-input-select awards-classlist-search-order"
				@change=${this._updateOrder}
				>
				<option>Award Leaders Descending</option>
				<option>Award Leaders Ascending</option>
				<option>Last Name A-Z</option>
				<option>Last Name Z-A</option>
				<option>First Name A-Z</option>
				<option>First Name Z-A</option>
			</select>
		</div>
		`;
	}

	_listUpdate(e) {
		const list = e.target;

		const state = list.getSelectionInfo().state;

		this.areStudentsSelected = state !== 'none';
	}

	_renderList() {
		return html`
		<d2l-list 
			id="classlist"
			separators="between"
			extend-separators
			@d2l-list-selection-change=${this._listUpdate}
			>
			${this.classlist.map(student => html`
			<d2l-list-item
				key = ${student.id}
				selectable
				>
				<img src=${student.picture}  slot="illustration">
				<div>
					${student.name}
				</div>
				<div slot="actions">
					${student.awards.length ? student.awards.map(award => html`${award}`) : html`This user has no awards`}
				</div>
			</d2l-list-item>
			`)}
		</d2l-list>
		`;
	}

	render() {
		return html`
		${this._renderDialogs()}
		${this._renderButtons()}
		${this._renderSearch()}
		${this._renderList()}
		`;
	}
}
customElements.define('d2l-awards-classlist', AwardsClasslist);
