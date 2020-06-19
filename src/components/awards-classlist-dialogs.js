import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class AwardsClasslistIssueDialog extends BaseMixin(LitElement) {

	static get properties() {
		return {
			issueDialogOpened: {
				type: Boolean
			},
			badges: {
				type: Array
			},
			selectedStudents: {
				type: Array
			},
			selectedAward: {
				type: String
			},
			awardCriteria: {
				type: String
			}
		};
	}

	static get styles() {
		return [
			selectStyles,
			inputLabelStyles,
			css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`];
	}

	constructor() {
		super();

		this.badges = ['Level Up', 'Hawkeye', 'Immortal', 'The Brave'];
		this.issueDialogOpened = false;
		this.selectedStudents = Array();
		this.awardCriteria = '';
		this.selectedAward = '';
	}

	dialogClosed() {
		this.issueDialogOpened = false;

		console.log(this.selectedAward);
		console.log(this.awardCriteria);

		this.selectedAward = '';
		this.awardCriteria = '';
	}

	selectAward() {
		this.selectedAward = this.shadowRoot.getElementById('issue-award-select').value;
	}

	changeAwardCriteria() {
		this.awardCriteria = this.shadowRoot.getElementById('issue-award-criteria').value;
	}

	render() {
		return html`
		<d2l-dialog 
			?opened=${this.issueDialogOpened}
			@d2l-dialog-close=${this.dialogClosed}
			title-text="Issue Award"
			>

			<label>
				<span class="d2l-input-label">Select Award*</span>
				<select 
					id="issue-award-select"
					class="d2l-input-select"
					@change=${this.selectAward}
					.value=${this.selectedAward}
					>
					<option></option>
					${this.badges.map(badge => html`
						<option>${badge}</option>
					`)}
				</select>
			</label>
			<d2l-input-text
				id="issue-award-criteria"
				label="Award Criteria"
				placeholder="Enter the award criteria"
				required
				aria-haspopup="true"
				@input=${this.changeAwardCriteria}
				.value=${this.awardCriteria}
				></d2l-input-text>

			<label  for="issueDialogStudentList" class="d2l-input-label">
				Selected Students (${this.selectedStudents.length})
			</label>
			<d2l-list 
				id="issueDialogStudentList"
				separators="between"
				extend-separators
				>
				${this.selectedStudents.map(name => html`
				<d2l-list-item>
					<div>
						${name}
					</div>
				</d2l-list-item>
				`)}
			</d2l-list>

			<d2l-button 
				slot="footer" 
				primary 
				data-dialog-action="done"
				?disabled=${this.selectedAward.length === 0 || this.awardCriteria.length === 0}
				>Issue</d2l-button>
			<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
		</d2l-dialog>
		`;
	}
}

class AwardsClasslistRevokeDialog extends BaseMixin(LitElement) {

	static get properties() {
		return {
			revokeDialogOpened: {
				type: Boolean
			},
			badges: {
				type: Array
			},
			selectedStudents: {
				type: Array
			},
			selectedAward: {
				type: String
			},
			revokeReason: {
				type: String
			}
		};
	}

	static get styles() {
		return [
			selectStyles,
			inputLabelStyles,
			css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`];
	}

	constructor() {
		super();

		this.badges = ['Level Up', 'Hawkeye', 'Immortal', 'The Brave'];
		this.revokeDialogOpened = false;
		this.selectedStudents = Array();
		this.revokeReason = '';
		this.selectedAward = '';
	}

	dialogClosed() {
		this.revokeDialogOpened = false;

		console.log(this.selectedAward);
		console.log(this.revokeReason);

		this.selectedAward = '';
		this.revokeReason = '';
	}

	selectAward() {
		this.selectedAward = this.shadowRoot.getElementById('revoke-award-select').value;
	}

	changeRevokeReason() {
		this.revokeReason = this.shadowRoot.getElementById('revoke-award-reason').value;
	}

	render() {
		return html`
		<d2l-dialog 
			?opened=${this.revokeDialogOpened}
			@d2l-dialog-close=${this.dialogClosed}
			title-text="Revoke Award"
			>

			<label>
				<span class="d2l-input-label">Select Award*</span>
				<select 
					id="revoke-award-select"
					class="d2l-input-select"
					@change=${this.selectAward}
					.value=${this.selectedAward}
					>
					<option></option>
					${this.badges.map(badge => html`
						<option>${badge}</option>
					`)}
				</select>
			</label>
			<d2l-input-text
				id="revoke-award-reason"
				label="Revoke Reason"
				placeholder="Enter the revoke reason"
				required
				aria-haspopup="true"
				@input=${this.changeRevokeReason}
				.value=${this.revokeReason}
				></d2l-input-text>

			<label  for="issueDialogStudentList" class="d2l-input-label">
				Selected Students (${this.selectedStudents.length})
			</label>
			<d2l-list 
				id="issueDialogStudentList"
				separators="between"
				extend-separators
				>
				${this.selectedStudents.map(name => html`
				<d2l-list-item>
					<div>
						${name}
					</div>
				</d2l-list-item>
				`)}
			</d2l-list>

			<d2l-button 
				slot="footer" 
				primary 
				data-dialog-action="done"
				?disabled=${this.selectedAward.length === 0 || this.revokeReason.length === 0}
				>Revoke</d2l-button>
			<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
		</d2l-dialog>
		`;
	}
}

customElements.define('d2l-awards-classlist-issue-dialog', AwardsClasslistIssueDialog);
customElements.define('d2l-awards-classlist-revoke-dialog', AwardsClasslistRevokeDialog);
