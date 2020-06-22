import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
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
			isValidOption: {
				type: Boolean
			},
			isValidCriteria: {
				type: Boolean
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
			.d2l-input-label {
				padding-top: 7px;
			}
			d2l-input-text {
				padding-top: 7px;
			}
		`];
	}

	constructor() {
		super();

		this.issueDialogOpened = false;
		this.selectedStudents = Array();
		this.isValidOption = true;
		this.isValidCriteria = true;
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchData();
	}

	async _fetchData() {
		window.AwardService.getAwards().then(data => this.badges = data.awards);
	}

	_selectAward(e) {
		this.isValidOption = window.ValidationService.optionSelected(e.target.value);
	}

	_changeAwardCriteria(e) {
		this.isValidCriteria = window.ValidationService.stringNotEmpty(e.target.value);
	}

	_dialogClosed() {
		this.issueDialogOpened = false;

		this.shadowRoot.getElementById('issue-award-select').value = '0';
		this.shadowRoot.getElementById('issue-award-criteria').value = '';
		this.isValidOption = true;
		this.isValidCriteria = true;
	}

	_onDone() {
		const selectedAward = this.shadowRoot.getElementById('issue-award-select').value;
		const awardCriteria = this.shadowRoot.getElementById('issue-award-criteria').value;

		this.isValidOption = window.ValidationService.optionSelected(selectedAward);
		this.isValidCriteria = window.ValidationService.stringNotEmpty(awardCriteria);

		if (this.isValidOption && this.isValidCriteria) {
			this.issueDialogOpened = false;
		}
	}

	render() {
		return html`
		<d2l-dialog 
			?opened=${this.issueDialogOpened}
			@d2l-dialog-close=${this._dialogClosed}
			title-text="Issue Award"
			>
			<label>
				<span class="d2l-input-label">
					Select Award *
				</span>
				<select 
					id="issue-award-select"
					class="d2l-input-select"
					aria-invalid=${!this.isValidOption}
					@change=${this._selectAward}
					>
					<option value=0></option>
					${this.badges.map((badge, index) => html`
						<option value=${index + 1}>${badge.name}</option>
					`)}
				</select>
				${!this.isValidOption ? html`
				<d2l-tooltip for="issue-award-select" state="error" align="start" offset="10">
					Please select an award
				</d2l-tooltip>
				` : html``}
			</label>
			<d2l-input-text
				id="issue-award-criteria"
				label="Award Criteria"
				placeholder="Enter the award criteria"
				required
				aria-haspopup="true"
				aria-invalid=${!this.isValidCriteria}
				@input=${this._changeAwardCriteria}
				>
			</d2l-input-text>
			${!this.isValidCriteria ? html`
			<d2l-tooltip for="issue-award-criteria" state="error" align="start" offset="10">
				Please provide an award criteria
			</d2l-tooltip>
			` : html``}
			

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
				@click=${this._onDone}
				>
				Issue
			</d2l-button>
			<d2l-button slot="footer" data-dialog-action>
				Cancel
			</d2l-button>
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
			isValidOption: {
				type: Boolean
			},
			isValidReason: {
				type: Boolean
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
			.d2l-input-label {
				padding-top: 7px;
			}
			d2l-input-text {
				padding-top: 7px;
			}
		`];
	}

	constructor() {
		super();

		this.revokeDialogOpened = false;
		this.selectedStudents = Array();
		this.isValidOption = true;
		this.isValidReason = true;
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchData();
	}

	async _fetchData() {
		window.AwardService.getAwards().then(data => this.badges = data.awards);
	}

	_selectAward(e) {
		this.isValidOption = window.ValidationService.optionSelected(e.target.value);
	}

	_changeRevokeReason(e) {
		this.isValidReason = window.ValidationService.stringNotEmpty(e.target.value);
	}

	_dialogClosed() {
		this.revokeDialogOpened = false;

		this.shadowRoot.getElementById('revoke-award-select').value = '0';
		this.shadowRoot.getElementById('revoke-award-reason').value = '';
		this.isValidOption = true;
		this.isValidReason = true;
	}

	_onDone() {
		const selectedAward = this.shadowRoot.getElementById('revoke-award-select').value;
		const revokeReason = this.shadowRoot.getElementById('revoke-award-reason').value;

		this.isValidOption = window.ValidationService.optionSelected(selectedAward);
		this.isValidReason = window.ValidationService.stringNotEmpty(revokeReason);

		if (this.isValidOption && this.isValidReason) {
			this.revokeDialogOpened = false;
		}
	}

	render() {
		return html`
		<d2l-dialog 
			?opened=${this.revokeDialogOpened}
			@d2l-dialog-close=${this._dialogClosed}
			title-text="Revoke Award"
			>
			<label>
				<span class="d2l-input-label">
					Select Award *
				</span>
				<select 
					id="revoke-award-select"
					class="d2l-input-select"
					aria-invalid=${!this.isValidOption}
					@change=${this._selectAward}
					>
					<option value=0></option>
					${this.badges.map((badge, index) => html`
						<option value=${index + 1}>${badge.name}</option>
					`)}
				</select>
			</label>
			<d2l-input-text
				id="revoke-award-reason"
				label="Revoke Reason"
				placeholder="Enter the revoke reason"
				required
				aria-haspopup="true"
				aria-invalid=${!this.isValidReason}
				@input=${this._changeRevokeReason}
				>
			</d2l-input-text>

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
				@click=${this._onDone}
				>
				Revoke
			</d2l-button>
			<d2l-button slot="footer" data-dialog-action>
				Cancel
			</d2l-button>
		</d2l-dialog>
		`;
	}
}

customElements.define('d2l-awards-classlist-issue-dialog', AwardsClasslistIssueDialog);
customElements.define('d2l-awards-classlist-revoke-dialog', AwardsClasslistRevokeDialog);
