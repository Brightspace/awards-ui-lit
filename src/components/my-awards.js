import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/link/link';
import '@brightspace-ui/core/components/button/button-subtle';
import './award-info-dialog';
import './helpers/search';
import { css, html, LitElement } from 'lit-element/lit-element';
import { awardsTableStyles } from '../styles/awards-table-styles';
import { BaseMixin } from '../mixins/base-mixin';
import { convertToDateString } from '../helpers';

const TMP_USER_ID = 101;

class MyAwards extends BaseMixin(LitElement) {
	static get properties() {
		return {
			orgUnitId: {
				attribute: 'org-unit-id',
				type: Number
			},
			detailedAward: {
				type: Object
			},
			issuedAwards: {
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
			.flex-container {
				display: flex;
				flex-flow: row wrap;
				justify-content: flex-start;
			}
			.flex-item {
				margin: 0.25rem;
				flex: 1;
			}
			.time-column {
				width: 25%;
			}
			.icon-column {
				width: 10%
			}
			d2l-awards-search {
				display: flex;
			}
			`
		];
	}

	constructor() {
		super();
		this.detailedAward = null;
		this.currentQuery = '';
		this.currentAwardType = window.AwardService.awardTypes[0].awardType;
		this.issuedAwards = [];
	}

	connectedCallback() {
		super.connectedCallback();
		this._fetchIssuedAwards();
	}

	async _fetchIssuedAwards() {
		const params = {
			awardType: this.currentAwardType,
			query: this.currentQuery,
			orgUnitId: this.orgUnitId,
			userId: TMP_USER_ID
		};
		const { awards } = await window.AwardService.getIssuedAwards(params);
		this.issuedAwards = awards;
	}

	async _handleSearchEvent(event) {
		const { detail: { value: query } } = event;
		this.currentQuery = query;
		await this._fetchIssuedAwards();
	}

	async _handleAwardTypeSelection(event) {
		const { detail: { value: index } } = event;
		this.currentAwardType = window.AwardService.awardTypes[index].awardType;
		await this._fetchIssuedAwards();
	}

	_getDialogOpenHandler(awardId) {
		return () => {
			const award = this.issuedAwards.find(award => award.Id === awardId);
			this.detailedAward = award;
		};
	}

	_handleDialogClosed() {
		this.detailedAward = null;
	}

	_renderComponentHeader() {
		const awardTypeOptions = window.AwardService.awardTypes.map(({ name }, index) => {
			return {
				value: index,
				name: name
			};
		});

		const selectorParams = {
			label: 'Awards Type Dropdown'
		};

		const searchParams = {
			label: 'Search for issued awards',
			placeholder: 'Search for issued awards'
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
			<td class='centered-column icon-column'>
				<img src='${award.ImgPath}' width='75%'/>
			</td>
			<td>
				<d2l-link aria-haspopup='true' @click="${this._getDialogOpenHandler(award.Id)}">${award.Name}</d2l-link>
			</td>
			<td>${award.Type}</td>
			<td>${award.Credits}</td>
			<td class='time-column'>${convertToDateString(award.IssueDate)}</td>
			<td class='time-column'>${convertToDateString(award.ExpirationDate)}</td>
		</tr>
		`;
	}

	_renderTable() {
		const renderedAwards = this.issuedAwards.map(award => this._renderAward(award));
		return renderedAwards.length > 0 ?
			html`
				<table class='flex-item' aria-label='Issued awards table'>
					<thead>
						<tr>
							<th class='icon-column'>Icon</th>
							<th>Name</th>
							<th>Type</th>
							<th>Credits</th>
							<th class='time-column'>Issue Date</th>
							<th class='time-column'>Expiration Date</th>
						</tr>
					</thead>
					<tbody>
						${renderedAwards}
					</tbody>
				</table>
			` :
			html`
			<div>
				<p>No awards found.</p>
			</div>
			`;
	}

	_renderAwardInfoPopup() {
		return html`
			<d2l-award-info-dialog
				.detailedAward='${this.detailedAward}'
				has-share-button
				has-print-button
				@d2l-dialog-close='${this._handleDialogClosed}'
				>
			</d2l-award-info-dialog>
		`;
	}

	render() {
		return html`
		${this._renderComponentHeader()}
		${this._renderTable()}
		${this._renderAwardInfoPopup()}
		`;
	}
}

customElements.define('d2l-my-awards', MyAwards);
