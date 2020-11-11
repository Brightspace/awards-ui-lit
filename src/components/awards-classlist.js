import './awards-classlist-dialogs.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

const ORG_UNIT_ID = 1000;

class AwardsClasslist extends BaseMixin(LitElement) {

	static get properties() {
		return {
			orgUnitId: {
				attribute: 'org-unit-id',
				type: Number
			},
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
			},
			currentListOrder: {
				type: String
			},
			currentQuery: {
				type: String
			},
			studentOrders: {
				type: Array
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
			.list-student-images {
				width: 50px;
				height: 50px;
				object-fit: contain;
			}
			d2l-awards-search {
				display: flex;
			}
		`];
	}

	constructor() {
		super();

		this.selectedStudents = Array();
		this.issueDialogOpened = false;
		this.revokeDialogOpened = false;
		this.areStudentsSelected = false;
		this.studentOrders = window.AwardService.studentOrders;
		this.currentListOrder = this.studentOrders[0].order;
		this.currentQuery = '';
		this.classlist = [];
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchData();
	}

	async _fetchData() {
		const params = {
			query: this.currentQuery,
			order: this.currentListOrder,
			orgUnitId: ORG_UNIT_ID
		};
		const { students } = await window.AwardService.getStudents(params);
		this.classlist = students;
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
			const student = this.classlist.find(student => student.Id === key);
			this.selectedStudents.push(`${student.FirstName} ${student.LastName}`);
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
		const { detail: { value: query } } = event;
		this.currentQuery = query;
		this._fetchData();
	}

	_updateOrder(event) {
		const { target: { value: index } } = event;
		this.currentListOrder = this.studentOrders[index].order;
		this._fetchData();
	}

	_renderSearch() {
		const orderOptions = this.studentOrders.map(({ name }, index) => {
			return {
				value: index,
				name: name
			};
		});

		const selectorParams = {
			label: 'Classlist ordering Dropdown'
		};

		const searchParams = {
			label: 'Search classlist',
			placeholder: 'Search classlist'
		};

		return html`
			<d2l-awards-search
				.selectorParams=${selectorParams}
				.selectorOptions=${orderOptions}
				.searchParams=${searchParams}
				@d2l-input-search-searched=${this._updateSearch}
				@d2l-selector-changed=${this._updateOrder}
				>
			</d2l-awards-search>
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
				key = ${student.Id}
				selectable
				>
				<img class="list-student-images" src=${student.Picture}  slot="illustration">
				<div>
					${student.FirstName} ${student.LastName}
				</div>
				<div slot="actions">
					${student.Awards.length ? student.Awards.map(award => html`${award}`) : html`This user has no awards`}
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
