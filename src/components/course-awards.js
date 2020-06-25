import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/inputs/input-search';
import '@brightspace-ui/core/components/inputs/input-checkbox';
import '@brightspace-ui/core/components/inputs/input-text';
import '@brightspace-ui/core/components/tooltip/tooltip';
import './add-awards-dialog';
import { css, html, LitElement } from 'lit-element/lit-element';
import { awardsTableStyles } from '../styles/awards-table-styles';
import { BaseMixin } from '../mixins/base-mixin';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

const CHECKBOX_BASE = 'checkbox-award-';
const TEXT_INPUT_BASE = 'text-input-award-';
const TEXT_INPUT_TOOLTIP_BASE = 'text-input-award-tooltip-';
const ORG_UNIT_ID = 1000;
const AWARD_TYPES = [
	{
		awardType: 'ALL',
		name: 'All Awards'
	},
	{
		awardType: 'BADGE',
		name: 'Badges'
	},
	{
		awardType: 'CERTIFICATE',
		name: 'Certificates'
	}
];

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
			uiAwardState: {
				type: Object
			},
			currentAwardType: {
				type: String
			},
			currentQuery: {
				type: String
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
			.flex-container {
				display: flex;
				flex-flow: row nowrap;
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
		`];
	}

	constructor() {
		super();
		this.addAwardsDialogOpen = false;
		this.currentQuery = '';
		this.currentAwardType = AWARD_TYPES[0].awardType;
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchAssociatedAwards();
	}

	async _fetchAssociatedAwards() {
		const params = {
			query: this.currentQuery,
			awardType: this.currentAwardType,
			orgUnitId: ORG_UNIT_ID
		};
		const { awards } = await window.AwardService.getAwards(params);

		this.courseAwards = awards;
		this.uiAwardState = {};
		this.courseAwards.forEach(award => {
			this.uiAwardState[award.id] = {
				enableEditing: false,
				invalidCredits: false
			};
		});
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

	_getEditAwardHandler(awardId) {
		return async() => {
			const award = this.courseAwards.find(award => award.id === awardId);
			const state = this.uiAwardState[award.id];

			if (state.enableEditing) {
				const inputTextEle = this.shadowRoot.getElementById(`${TEXT_INPUT_BASE}${awardId}`);
				const checkboxEle = this.shadowRoot.getElementById(`${CHECKBOX_BASE}${awardId}`);

				if (!window.ValidationService.isNonNegativeNumber(inputTextEle.value)) {
					return;
				}

				// update the award
				award.credits = inputTextEle.value;
				award.hiddenUntilEarned = checkboxEle.checked;
				await window.AwardService.updateAward({ award });

				// get the awards again
				await this._fetchAssociatedAwards();
			}
			state.enableEditing = !state.enableEditing;
			this.requestUpdate();
		};
	}

	_handleInputChangedEvent(event) {
		const { target: { id: textInputId } } = event;
		const inputTextEle = this.shadowRoot.getElementById(textInputId);
		const awardId = textInputId.replace(`${TEXT_INPUT_BASE}`, '');
		const state = this.uiAwardState[awardId];

		if (!window.ValidationService.isNonNegativeNumber(inputTextEle.value) && !state.invalidCredits) {
			state.invalidCredits = true;
			this.requestUpdate();
		} else if (state.invalidCredits) {
			state.invalidCredits = false;
			this.requestUpdate();
		}
	}

	_getDeleteAwardHandler(awardId) {
		return () => {
			const award = this.courseAwards.find(award => award.id === awardId);
			window.AwardService.deleteAward({ award });
		};
	}

	async _handleAwardTypeSelection(event) {
		const { target: { value: index } } = event;
		this.currentAwardType = AWARD_TYPES[index].awardType;
		await this._fetchAssociatedAwards();
	}

	_renderComponentHeader() {
		return html`
		<d2l-input-checkbox
			@change='${this._handleBadgrUpdate}'
			>
			Allow users in this course to send earned awards to Badgr Backpack
		</d2l-input-checkbox>
		<div class='flex-container'>
			<d2l-input-search
				class='flex-item'
				label='Search for course awards'
				placeholder='Search for course awards'
				@d2l-input-search-searched='${this._handleSearchEvent}'
				>
			</d2l-input-search>
			<d2l-button
				class='flex-item'
				id='add-award-button'
				text='Add Awards to Course'
				aria-label='Add Awards to Course'
				aria-haspopup='true'
				primary
				@click='${this._handleAddAwardClicked}'
				>
				Add Awards to Course
			</d2l-button>
		</div>
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
		const textInputId = `${TEXT_INPUT_BASE}${award.id}`;
		const state = this.uiAwardState[award.id];

		if (state.enableEditing) {
			let tooltipTempalte = html``;
			const inputTextTemplate = html`
				<d2l-input-text
					label-hidden
					id='${textInputId}'
					title='Credits'
					label='Credits'
					placeholder='0.0'
					value='${award.credits}'
					size=1
					aria-invalid='${state.invalidCredits}'
					@input='${this._handleInputChangedEvent}'
					>
				</d2l-input-text>`;
			if (state.invalidCredits) {
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
			fullTemplate = html`<p>${award.credits}</p>`;
		}
		return fullTemplate;
	}

	_getHiddenAwardElement(award) {
		return this.uiAwardState[award.id].enableEditing ?
			html`
			<d2l-input-checkbox
				id='${CHECKBOX_BASE}${award.id}'
				class='hidden-checkbox flex-item'
				?checked=${award.hiddenUntilEarned}
				>
			</d2l-input-checkbox>` :
			html`
			<d2l-button-icon
				text=${award.hiddenUntilEarned ? 'Hidden' : 'Not Hidden'}
				icon=${award.hiddenUntilEarned ? 'tier1:check' : 'tier1:close-default'}
				>
			</d2l-button-icon>
			`;
	}

	_renderAward(award) {
		const state = this.uiAwardState[award.id];
		return html`
		<tr>
			<td class='centered-column icon-column'>
				<img src='${award.imgPath}' width='75%'/>
			</td>
			<td>${award.name}</td>
			<td>${award.type}</td>
			<td>
				${this._getCreditsElement(award)}
			</td>
			<td class='centered-column'>
				${this._getHiddenAwardElement(award)}
			</td>
			<td class='centered-column'>
				<d2l-button-icon
					text=${state.enableEditing ? `Finish editing award ${award.name}` : `Edit award ${award.name}`}
					icon=${state.enableEditing ? 'tier1:save' : 'tier1:edit'}
					@click='${this._getEditAwardHandler(award.id)}'
					>
				</d2l-button-icon>
			</td>
			<td class='centered-column'>
				<d2l-button-icon
					text='Delete Award'
					icon='tier1:delete'
					@click='${this._getDeleteAwardHandler(award.id)}'
					>
				</d2l-button-icon>
			</td>
		</tr>
		`;
	}

	_renderTableHeader() {
		const awardTypeOptions = AWARD_TYPES.map(({ name }, index) => {
			return html`<option value=${index}>${name}</option>`;
		});
		return html`
		<div class='flex-container'>
			<div id='input-select-div flex-item'>
				<select
					class='d2l-input-select flex-item'
					aria-label='Awards Type Dropdown'
					@input='${this._handleAwardTypeSelection}'
					>
					${awardTypeOptions}
				</select>
			</div>
		</div>
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
		${this._renderComponentHeader()}
		${this._renderTableHeader()}
		${this._renderTable()}
		`;
	}
}
customElements.define('d2l-course-awards', CourseAwards);
