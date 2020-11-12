import { css, html, LitElement } from 'lit-element/lit-element';
import { awardsTableStyles } from '../styles/awards-table-styles';
import { BaseMixin } from '../mixins/base-mixin';

class AvailableAwards extends BaseMixin(LitElement) {
	static get properties() {
		return {
			orgUnitId: {
				attribute: 'org-unit-id',
				type: Number
			},
			availableAwards: {
				type: Array
			},
			currentQuery: {
				type: String
			},
			currentAwardType: {
				type: String
			}
		};
	}

	static get styles() {
		return [
			awardsTableStyles,
			css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.table__icon {
				max-width: 100px;
			}
			d2l-awards-search {
				display: flex;
			}
			`
		];
	}

	constructor() {
		super();
		this.currentQuery = '';
		this.currentAwardType = window.AwardService.awardTypes[0].awardType;
		this.availableAwards = [];
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchAvailableAwards();
	}

	async _fetchAvailableAwards() {
		const params = {
			awardType: this.currentAwardType,
			query: this.currentQuery,
			orgUnitId: this.orgUnitId
		};
		const { awards } = await window.AwardService.getAwards(params);
		this.availableAwards = awards;
	}

	async _handleSearchEvent(event) {
		const { detail: { value: query } } = event;
		this.currentQuery = query;
		await this._fetchAvailableAwards();
	}

	async _handleAwardTypeSelection(event) {
		const { detail: { value: index } } = event;
		this.currentAwardType = window.AwardService.awardTypes[index].awardType;
		await this._fetchAvailableAwards();
	}

	_renderComponentHeader() {
		const awardTypeOptions = window.AwardService.awardTypes.map(({ name }, index) => {
			return {
				value: index,
				name: name
			};
		});

		const selectorParams = {
			label: this.localize('issued-awards-selector-label')
		};

		const searchParams = {
			label: this.localize('issued-awards-search-placeholder'),
			placeholder: this.localize('issued-awards-search-placeholder')
		};

		return html`
			<d2l-awards-search
				.selectorParams=${selectorParams}
				.selectorOptions=${awardTypeOptions}
				.searchParams=${searchParams}
				@d2l-input-search-searched=${this._handleSearchEvent}
				@d2l-selector-changed=${this._handleAwardTypeSelection}
				>
			</d2l-awards-search>
		`;
	}

	_renderAward(award) {
		return html`
		<tr>
			<td class='table__td table__td--pad-top table__td--center'>
				<img class="table__icon" src='${award.ImgPath}' width='75%'/>
			</td>
			<td class='table__td'>${award.Name}</td>
			<td class='table__td'>${award.Course}</td>
			<td class='table__td'>${award.Description}</td>
		</tr>
		`;
	}

	_renderTable() {
		const renderedAwards = this.availableAwards.map(award => this._renderAward(award));
		return renderedAwards.length > 0 ?
			html`
				<table class='table' aria-label='Available awards'>
					<thead>
						<tr>
							<th class='table__th table__td--center'>${this.localize('table-header-icon')}</th>
							<th class='table__th'>${this.localize('table-header-name')}</th>
							<th class='table__th'>${this.localize('table-header-course')}</th>
							<th class='table__th'>${this.localize('table-header-description')}</th>
						</tr>
					</thead>
					<tbody>
						${renderedAwards}
					</tbody>
				</table>
			` :
			html`
			<div>
				<p>${this.localize('no-awards')}</p>
			</div>
			`;
	}

	render() {
		return html`
			${this._renderComponentHeader()}
			${this._renderTable()}
		`;
	}
}

customElements.define('d2l-available-awards', AvailableAwards);
