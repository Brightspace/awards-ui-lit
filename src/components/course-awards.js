import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/inputs/input-search';
import '@brightspace-ui/core/components/inputs/input-checkbox';
import '@brightspace-ui/core/components/inputs/input-text';
import '@brightspace-ui/core/components/tooltip/tooltip';
import '@brightspace-ui/core/components/dialog/dialog-confirm';
import './add-awards-dialog';
import './award-info-dialog';
import './helpers/search';
import { css, html, LitElement } from 'lit-element/lit-element';
import { awardsTableStyles } from '../styles/awards-table-styles';
import { BaseMixin } from '../mixins/base-mixin';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

const CHECKBOX_BASE = 'checkbox-award-';
const TEXT_INPUT_BASE = 'text-input-award-';
const TEXT_INPUT_TOOLTIP_BASE = 'text-input-award-tooltip-';

const SAVE_ACTION = 'save';
const DELETE_ACTION = 'delete';
const CANCEL_ACTION = 'cancel';

class CourseAwards extends BaseMixin(LitElement) {
	static get properties() {
		return {
			orgUnitId: {
				attribute: 'org-unit-id',
				type: Number
			},
			addAwardsDialogOpen: {
				type: Boolean
			},
			courseAwards: {
				type: Array
			},
			currentAwardType: {
				type: String
			},
			currentQuery: {
				type: String
			},
			awardTypes: {
				type: Array
			},
			awardBeingEdited: {
				type: Number
			},
			invalidCredits: {
				type: Boolean
			},
			detailedAward: {
				type: Object
			}
		};
	}

	static get styles() {
		return [
			awardsTableStyles,
			selectStyles,
			css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.flex-item {
				margin: 0.25rem;
			}
			d2l-input-search.flex-item {
				flex-grow: 2;
			}
			d2l-input-checkbox {
				margin: 0.25rem;
			}
			.icon-column {
				width: 10%;
			}
			d2l-awards-search {
				display: flex;
			}
		`];
	}

	constructor() {
		super();
		this.addAwardsDialogOpen = false;
		this.currentQuery = '';
		this.awardTypes = window.AwardService.awardTypes;
		this.currentAwardType = this.awardTypes[0].awardType;
		this.invalidCredits = false;
		this.awardBeingEdited = null;
		this.detailedAward = null;
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchAssociatedAwards();
	}

	async _fetchAssociatedAwards() {
		const params = {
			query: this.currentQuery,
			awardType: this.currentAwardType,
			orgUnitId: this.orgUnitId
		};
		const { awards } = await window.AwardService.getAssociatedAwards(params);

		this.courseAwards = awards;
		this.awardBeingEdited = null; // clear editing state because we either reloaded, saved, or deleted
		this.invalidCredits = false;
	}

	async _handleSearchEvent(event) {
		const { detail: { value: query } } = event;
		this.currentQuery = query;
		await this._fetchAssociatedAwards();
	}

	_handleBadgrUpdate() {
		console.log('TODO: Support Badgr'); // call API
	}

	_handleAddAwardClicked() {
		this.addAwardsDialogOpen = true;
	}

	async _handleAwardsAdded() {
		await this._fetchAssociatedAwards();
	}

	_handleAwardDialogClosed() {
		this.addAwardsDialogOpen = false;
	}

	async _updateAward(award) {
		const inputTextEle = this.shadowRoot.getElementById(`${TEXT_INPUT_BASE}${award.Id}`);
		const checkboxEle = this.shadowRoot.getElementById(`${CHECKBOX_BASE}${award.Id}`);

		if (this.invalidCredits) {
			return;
		}

		// update the award
		award.Credits = inputTextEle.value;
		award.HiddenUntilEarned = checkboxEle.checked;
		await window.AwardService.updateAward({ award });

		// get the awards again
		await this._fetchAssociatedAwards();
	}

	async _userIsDoneEditing(awardId) {
		const userIsEditing = this.awardBeingEdited !== null && this.awardBeingEdited !== awardId;
		let userIsDone = true; // they're done if they were never editing in the first place
		if (userIsEditing) {
			// ask the user if they want to save first
			const dialog = this.shadowRoot.querySelector('d2l-dialog-confirm#save-dialog');
			const action = await dialog.open();
			if (action === SAVE_ACTION) {
				const editedAward = this.courseAwards.find(award => award.Id === this.awardBeingEdited);
				await this._updateAward(editedAward);
			} else if (action === CANCEL_ACTION) {
				userIsDone = false;
			}
		}

		return userIsDone;
	}

	_getEditAwardHandler(awardId) {
		return async() => {
			const award = this.courseAwards.find(award => award.Id === awardId);

			const userIsDone = await this._userIsDoneEditing(award.Id);
			if (!userIsDone) {
				return;
			}

			if (this.awardBeingEdited === award.Id) { // we're finishing editing
				await this._updateAward(award);
			} else if (this.awardBeingEdited === null) {
				this.awardBeingEdited = award.Id;
			}
		};
	}

	_handleInputChangedEvent(event) {
		const { target: { id: textInputId } } = event;
		const inputTextEle = this.shadowRoot.getElementById(textInputId);

		if (!window.ValidationService.isNonNegativeNumber(inputTextEle.value) && !this.invalidCredits) {
			this.invalidCredits = true;
		} else if (this.invalidCredits) {
			this.invalidCredits = false;
		}
	}

	_getDeleteAwardHandler(awardId) {
		return async() => {
			const award = this.courseAwards.find(award => award.Id === awardId);
			const userIsDone = await this._userIsDoneEditing(award.Id);
			if (!userIsDone) {
				return;
			}

			const dialog = this.shadowRoot.querySelector('d2l-dialog-confirm#delete-dialog');
			const action = await dialog.open();
			if (action === DELETE_ACTION) {
				await window.AwardService.deleteAward({ award });
				await this._fetchAssociatedAwards();
			}
		};
	}

	async _handleAwardTypeSelection(event) {
		const { detail: { value: index } } = event;
		this.currentAwardType = this.awardTypes[index].awardType;
		await this._fetchAssociatedAwards();
	}

	_getAwardInfoOpenHandler(awardId) {
		return () => {
			const award = this.courseAwards.find(award => award.Id === awardId);
			this.detailedAward = award;
		};
	}

	_handleAwardInfoDialogClosed() {
		this.detailedAward = null;
	}

	_renderComponentHeader() {
		const awardTypeOptions = this.awardTypes.map(({ name }, index) => {
			return {
				value: index,
				name: name
			};
		});

		const selectorParams = {
			label: 'Awards Type Dropdown'
		};

		const searchParams = {
			label: 'Search for course awards',
			placeholder: 'Search for course awards'
		};

		const buttonParams = {
			id: 'add-award-button',
			text: 'Add Awards to Course',
			label: 'Add Awards to Course',
			haspopup: 'true',
			primary: true
		};

		return html`
		<d2l-input-checkbox
			@change='${this._handleBadgrUpdate}'
			>
			Allow users in this course to send earned awards to Badgr Backpack
		</d2l-input-checkbox>
		<d2l-awards-search
			.selectorParams=${selectorParams}
			.selectorOptions=${awardTypeOptions}
			.searchParams=${searchParams}
			.buttonParams=${buttonParams}
			@d2l-input-search-searched=${this._handleSearchEvent}
			@d2l-selector-changed=${this._handleAwardTypeSelection}
			@d2l-button-pressed=${this._handleAddAwardClicked}
			>
		</d2l-awards-search>
		`;
	}

	_renderTable() {
		const renderedAwards = this.courseAwards && this.courseAwards.map(award => this._renderAward(award));
		return renderedAwards.length !== 0 ?
			html`
			<table class='flex-item' aria-label='Course awards table'>
				<thead>
					<tr>
						<th class='centered-column'>Icon</th>
						<th>Name</th>
						<th>Type</th>
						<th>Credits</th>
						<th>Hidden Until Earned</th>
						<th class='centered-column'>Edit</th>
						<th class='centered-column'>Delete</th>
					</tr>
				</thead>
				<tbody>
					${renderedAwards}
				</tbody>
			</table>` :
			html`<p>No awards found</p>`;
	}

	_getCreditsElement(award) {
		let fullTemplate;
		const textInputId = `${TEXT_INPUT_BASE}${award.Id}`;

		if (this.awardBeingEdited === award.Id) {
			let tooltipTempalte = html``;
			const inputTextTemplate = html`
				<d2l-input-text
					label-hidden
					id='${textInputId}'
					title='Credits'
					label='Credits'
					placeholder='0.0'
					value='${award.Credits}'
					size=1
					aria-invalid='${this.invalidCredits}'
					@input='${this._handleInputChangedEvent}'
					novalidate
					>
				</d2l-input-text>`;
			if (this.invalidCredits) {
				tooltipTempalte = html`
					<d2l-tooltip
						id='${TEXT_INPUT_TOOLTIP_BASE}${award.id}'
						state='error'
						align='start'
						>
						Please enter a non-negative number
					</d2l-tooltip>`;
			}
			fullTemplate = html`
				${inputTextTemplate}
				${tooltipTempalte}
			`;
		} else {
			fullTemplate = html`<p>${award.Credits}</p>`;
		}
		return fullTemplate;
	}

	_getHiddenAwardElement(award) {
		return this.awardBeingEdited === award.Id ?
			html`
			<d2l-input-checkbox
				id='${CHECKBOX_BASE}${award.Id}'
				class='hidden-checkbox flex-item'
				?checked=${award.HiddenUntilEarned}
				>
			</d2l-input-checkbox>` :
			html`
			<d2l-icon
				icon=${award.HiddenUntilEarned ? 'tier1:check' : 'tier1:close-default'}
				aria-label=${award.HiddenUntilEarned ? 'Hidden' : 'Not Hidden'}
				>
			</d2l-icon>
			`;
	}

	_renderAward(award) {
		const awardIsBeingEdited = this.awardBeingEdited === award.Id;
		return html`
		<tr>
			<td class='centered-column icon-column'>
				<img src='${award.ImgPath}' width='75%'/>
			</td>
			<td>
				<d2l-link
					aria-haspopup='true'
					@click='${this._getAwardInfoOpenHandler(award.Id)}'
					>
					${award.Name}
				</d2l-link>
			</td>
			<td>${award.Type}</td>
			<td>
				${this._getCreditsElement(award)}
			</td>
			<td class='centered-column'>
				${this._getHiddenAwardElement(award)}
			</td>
			<td class='centered-column'>
				<d2l-button-icon
					text=${awardIsBeingEdited ? `Finish editing award ${award.Name}` : `Edit award ${award.Name}`}
					icon=${awardIsBeingEdited ? 'tier1:save' : 'tier1:edit'}
					@click='${this._getEditAwardHandler(award.Id)}'
					aria-haspopup='true'
					>
				</d2l-button-icon>
			</td>
			<td class='centered-column'>
				<d2l-button-icon
					text='Delete Award'
					icon='tier1:delete'
					@click='${this._getDeleteAwardHandler(award.Id)}'
					aria-haspopup='true'
					>
				</d2l-button-icon>
			</td>
		</tr>
		`;
	}

	render() {
		return html`
		<d2l-add-awards-dialog
			?opened=${this.addAwardsDialogOpen}
			@d2l-dialog-close=${this._handleAwardDialogClosed}
			@d2l-add-awards-dialog-done-clicked=${this._handleAwardsAdded}
			>
		</d2l-add-awards-dialog>
		<d2l-award-info-dialog
			.detailedAward='${this.detailedAward}'
			@d2l-dialog-close='${this._handleAwardInfoDialogClosed}'
			>
		</d2l-award-info-dialog>
		<d2l-dialog-confirm id='save-dialog' title-text='Save changes?' text='Do you want to save your changes?'>
			<d2l-button slot='footer' primary data-dialog-action='${SAVE_ACTION}'>Save</d2l-button>
			<d2l-button slot='footer' data-dialog-action='${CANCEL_ACTION}'>Cancel</d2l-button>
		</d2l-dialog-confirm>
		<d2l-dialog-confirm id='delete-dialog' title-text='Delete award?' text='Are you sure you want to delete this award?'>
			<d2l-button slot='footer' primary data-dialog-action='${DELETE_ACTION}'>Delete</d2l-button>
			<d2l-button slot='footer' data-dialog-action='${CANCEL_ACTION}'>Cancel</d2l-button>
		</d2l-dialog-confirm>
		${this._renderComponentHeader()}
		${this._renderTable()}
		`;
	}
}
customElements.define('d2l-course-awards', CourseAwards);
