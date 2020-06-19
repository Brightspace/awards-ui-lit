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
			.d2l-awards-classlist-search {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin: 12px;
			}
			.d2l-awards-classlist-search-input {
				flex-grow: 1;
				margin: 6px;
			}
			.d2l-awards-classlist-search-order {
				margin: 6px;
			}
		`];
	}

	constructor() {
		super();

		this.classlist = [
			{
				'id': '1',
				'name': 'Bilbo Baggins',
				'awards': [],
				'picture': 'https://external-preview.redd.it/h_toqTwoOJ4LeP1Z2VGXaCO3HujYejJc7uKzZdbPRUA.jpg?auto=webp&s=82b4a93f58ae2770d8ef72d2418b9c34d1835818'
			},
			{
				'id': '2',
				'name': 'Gandalf the Grey',
				'awards': ['Level Up'],
				'picture': 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbERWUaUohwgPCeQRw917eaNB1OQo1TIYmN_WAZe7V_sQ4dO_L&usqp=CAU'
			},
			{
				'id': '3',
				'name': 'Samwise Gamgee',
				'awards': [],
				'picture': 'https://vignette.wikia.nocookie.net/middle-earth-film-saga/images/5/52/Sam_TTT_profile.png/revision/latest?cb=20190727211735'
			},
			{
				'id': '4',
				'name': 'Aragorn Elessar',
				'awards': [],
				'picture': 'https://nerdist.com/wp-content/uploads/2018/05/Lord-of-the-Rings-Aragorn-Viggo-Mortensen-1.jpg'
			},
			{
				'id': '5',
				'name': 'Legolas',
				'awards': ['Hawkeye'],
				'picture': 'https://superherojacked.com/wp-content/uploads/2019/05/Legolas-Workout-2-1024x539.jpg'
			}
		];
		this.selectedStudents = Array();
		this.issueDialogOpened = false;
		this.revokeDialogOpened = false;
		this.areStudentsSelected = false;
	}

	issueDialogClosed(event) {
		this.issueDialogOpened = false;

		if (event.detail.action === 'done') {
			console.log('Pressed Done');
		}
	}

	revokeDialogClosed(event) {
		this.revokeDialogOpened = false;

		if (event.detail.action === 'done') {
			console.log('Pressed Done');
		}
	}

	renderDialogs() {
		return html`
		<d2l-awards-classlist-issue-dialog 
			?issueDialogOpened=${this.issueDialogOpened} 
			@d2l-dialog-close=${this.issueDialogClosed}
			.selectedStudents=${this.selectedStudents}></d2l-awards-classlist-issue-dialog>
		<d2l-awards-classlist-revoke-dialog 
			?revokeDialogOpened=${this.revokeDialogOpened} 
			@d2l-dialog-close=${this.revokeDialogClosed}
			.selectedStudents=${this.selectedStudents}></d2l-awards-classlist-revoke-dialog>
		`;
	}

	issueButtonClicked() {
		const keys = this.shadowRoot.getElementById('classlist').getSelectionInfo().keys;

		this.selectedStudents = Array();
		for (const key of keys) {
			this.selectedStudents.push(this.classlist.find(student => student.id === key).name);
		}

		this.issueDialogOpened = true;
	}

	revokeButtonClicked() {
		this.revokeDialogOpened = true;
	}

	renderButtons() {
		return html`
		<d2l-button
			@click=${this.issueButtonClicked}
			description="Issue an award to students selected"
			primary
			aria-haspopup="true"
			?disabled=${!this.areStudentsSelected}
			>
			Issue
		</d2l-button>
		<d2l-button
			@click=${this.revokeButtonClicked}
			description="Revoke an award to students selected"
			aria-haspopup="true"
			?disabled=${!this.areStudentsSelected}
			>
			Revoke
		</d2l-button>
		`;
	}

	updateSearch(event) {
		console.log(event);
	}

	updateOrder(event) {
		console.log(event);
	}

	renderSearch() {
		return html`
		<div class="d2l-awards-classlist-search">
			<d2l-input-search
				label="Search classlist"
				placeholder="Search classlist"
				@d2l-input-search-searched=${this.updateSearch}
				class="d2l-awards-classlist-search-input"
				>
			</d2l-input-search>
			<select 
				class="d2l-input-select d2l-awards-classlist-search-order"
				@change=${this.updateOrder}
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

	listUpdate() {
		const list = this.shadowRoot.getElementById('classlist');

		const state = list.getSelectionInfo().state;

		this.areStudentsSelected = state !== 'none';
	}

	renderList() {
		return html`
		<d2l-list 
			id="classlist"
			separators="between"
			extend-separators
			@d2l-list-selection-change=${this.listUpdate}
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
		${this.renderDialogs()}
		${this.renderButtons()}
		${this.renderSearch()}
		${this.renderList()}
		`;
	}
}
customElements.define('d2l-awards-classlist', AwardsClasslist);
