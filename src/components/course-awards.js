import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/inputs/input-search';
import '@brightspace-ui/core/components/inputs/input-checkbox';
import '@brightspace-ui/core/components/inputs/input-text';
import '@brightspace-ui/core/components/tooltip/tooltip';
import '@brightspace-ui/core/components/dialog/dialog-confirm';
import '@brightspace-ui/core/components/dropdown/dropdown';
import '@brightspace-ui/core/components/dropdown/dropdown-menu';
import '@brightspace-ui/core/components/menu/menu';
import '@brightspace-ui/core/components/menu/menu-item';
import './add-awards-dialog';
import './award-info-dialog';
import './helpers/search';
import { css, html, LitElement } from 'lit-element/lit-element';
import { awardsTableStyles } from '../styles/awards-table-styles';
import { BaseMixin } from '../mixins/base-mixin';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

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
			table__td--small {
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

	_getDeleteAwardHandler(awardId) {
		return async() => {
			const award = this.courseAwards.find(award => award.Id === awardId);

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

	async _handleAwardInfoDialogClosed() {
		this.detailedAward = null;
		await this._fetchAssociatedAwards();
	}

	_renderActionChevron(awardRowId) {
		return html`
			<d2l-dropdown>
				<d2l-button-icon icon="tier2:chevron-down" class="d2l-dropdown-opener"></d2l-button-icon>
				<d2l-dropdown-menu>
					<d2l-menu>
						<d2l-menu-item
							text=${this.localize('edit-button-text')}
							@click="${this._getAwardInfoOpenHandler(awardRowId)}">
						</d2l-menu-item>
						<d2l-menu-item
							text=${this.localize('delete-button-text')}
							@click="${this._getDeleteAwardHandler(awardRowId)}">
						</d2l-menu-item>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
	}

	_renderComponentHeader() {
		const awardTypeOptions = this.awardTypes.map(({ name }, index) => {
			return {
				value: index,
				name: name
			};
		});

		const selectorParams = {
			label: this.localize('issued-awards-selector-label')
		};

		const searchParams = {
			label: this.localize('course-awards-search-label'),
			placeholder: this.localize('course-awards-search-label')
		};

		const buttonParams = {
			id: 'add-award-button',
			text: this.localize('course-awards-button-text'),
			label: this.localize('course-awards-button-text'),
			haspopup: 'true',
			primary: true
		};

		return html`
		<d2l-input-checkbox
			@change='${this._handleBadgrUpdate}'
			>
			${this.localize('badgr-checkbox-text')}
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
			<table class='table flex-item' aria-label='Course awards table'>
				<thead>
					<tr>
						<th class='table__th table__td--center'>${this.localize('table-header-icon')}</th>
						<th class='table__th'>${this.localize('table-header-name')}</th>
						<th class='table__th'>${this.localize('table-header-type')}</th>
						<th class='table__th'>${this.localize('table-header-credits')}</th>
						<th class='table__th'>${this.localize('table-header-hidden-until-earned')}</th>
					</tr>
				</thead>
				<tbody>
					${renderedAwards}
				</tbody>
			</table>` :
			html`<p>${this.localize('no-awards')}</p>`;
	}

	_getHiddenAwardElement(award) {
		return html`
			<d2l-icon
				icon=${award.HiddenUntilEarned ? 'tier1:check' : 'tier1:close-default'}
				aria-label=${award.HiddenUntilEarned ? this.localize('hidden') : this.localize('not-hidden')}
				>
			</d2l-icon>
		`;
	}

	_renderAward(award) {
		return html`
		<tr>
			<td class='table__td table__td--center table__td--small'>
				<img src='${award.ImgPath}' width='75%'/>
			</td>
			<td class='table__td'>
				${award.Name}
				${ this._renderActionChevron(award.Id) }
			</td>
			<td class='table__td'>${award.Type}</td>
			<td class='table__td'>
				<p>${award.Credits}</p>
			</td>
			<td class='table__td table__td--center'>
				${this._getHiddenAwardElement(award)}
			</td>
		</tr>
		`;
	}

	_renderDialogs() {
		return html`
		<d2l-add-awards-dialog
			?opened=${this.addAwardsDialogOpen}
			@d2l-dialog-close=${this._handleAwardDialogClosed}
			@d2l-add-awards-dialog-done-clicked=${this._handleAwardsAdded}
			>
		</d2l-add-awards-dialog>
		<d2l-award-info-dialog
			edit
			.detailedAward='${this.detailedAward}'
			@d2l-dialog-close='${this._handleAwardInfoDialogClosed}'
			>
		</d2l-award-info-dialog>
		<d2l-dialog-confirm
			id='delete-dialog'
			title-text=${this.localize('delete-dialog-title')}
			text=${this.localize('delete-dialog-text')}
			>
			<d2l-button
				slot='footer'
				primary
				data-dialog-action='${DELETE_ACTION}'
				>
				${this.localize('delete-action')}
			</d2l-button>
			<d2l-button
				slot='footer'
				data-dialog-action='${CANCEL_ACTION}'
				>
				${this.localize('cancel-action')}
			</d2l-button>
		</d2l-dialog-confirm>
		`;
	}

	render() {
		return html`
		${this._renderDialogs()}
		${this._renderComponentHeader()}
		${this._renderTable()}
		`;
	}
}
customElements.define('d2l-course-awards', CourseAwards);
