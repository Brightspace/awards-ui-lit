import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/inputs/input-search';
import '@brightspace-ui/core/components/link/link';
import '@brightspace-ui/core/components/button/button-subtle';
import { css, html, LitElement } from 'lit-element/lit-element';
import { awardsTableStyles } from '../styles/awards-table-styles';
import { BaseMixin } from '../mixins/base-mixin';
import dayjs from 'dayjs/esm';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

const TMP_USER_ID = 101;
const NEVER_EXPIRATION = 'Never';

function convertToDateString(dateStr) {
	if (dateStr === NEVER_EXPIRATION || !dateStr) {
		return dateStr;
	}

	const formattedStr = dayjs(dateStr).format('dddd, MMMM D, YYYY h:mm A');
	return formattedStr;
}

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
			selectStyles,
			css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.flex-container-header {
				display: flex;
				flex-flow: row nowrap;
				width: 100%;
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
			d2l-input-search.flex-item {
				flex: 4;
			}
			.time-column {
				width: 25%;
			}
			.icon-column {
				width: 10%
			}
			.flex-award-popup {
				display: flex;
				flex-flow: column wrap;
			}
			.flex-award-image {
				align-self: center;
			}
			.flex-award-share-print {
				display: flex;
				flex-flow: row wrap;
				justify-content: center;
				align-items: center;
			}
			`
		];
	}

	constructor() {
		super();
		this.detailedAward = null;
		this.currentQuery = '';
		this.currentAwardType = window.AwardService.awardTypes[0].awardType;
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
		const { target: { value: index} } = event;
		this.currentAwardType = window.AwardService.awardTypes[index].awardType;
		await this._fetchIssuedAwards();
	}

	_getPrintHandler(awardId) {
		return () => {
			const award = this.issuedAwards.find(award => award.Id === awardId);
			console.log(`TODO: Print the following award: ${JSON.stringify(award)}`);
		};
	}

	_getShareHandler(awardId) {
		return () => {
			const award = this.issuedAwards.find(award => award.Id === awardId);
			console.log(`TODO: Share the following award on Badgr: ${JSON.stringify(award)}`);
		};
	}

	_getDialogOpenHandler(awardId) {
		return () => {
			const award = this.issuedAwards.find(award => award.Id === awardId);
			this.detailedAward = award;
			console.log(`updated detailed award to ${this.detailedAward}`);
		};
	}

	_handleDialogClosed() {
		this.detailedAward = null;
		console.log('update detailed award to null');
	}

	_renderComponentHeader() {
		const awardTypeOptions = window.AwardService.awardTypes.map(({ name }, index) => {
			return html`<option value=${index}>${name}</option>`;
		});

		return html`
			<div class='flex-container-header'>
			<d2l-input-search
				class='flex-item'
				label='Search for issued awards'
				placeholder='Search for issued awards'
				@d2l-input-search-searched='${this._handleSearchEvent}'
				>
			</d2l-input-search>
			<select
				class='d2l-input-select flex-item'
				aria-label='Awards Type Dropdown'
				@input='${this._handleAwardTypeSelection}'
				>
				${awardTypeOptions}
			</select>
		</div>
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
				<p>You have not been issued any awards.</p>
			</div>
			`;
	}

	_renderAwardPopup() {
		const isOpen = this.detailedAward !== null;
		return isOpen ? html`
			<d2l-dialog
				title-text='${this.detailedAward.Name}'
				?opened=${isOpen}
				@d2l-dialog-close=${this._handleDialogClosed}
				>
				<div class='flex-award-popup'>
					<img class='flex-award-image' src=${this.detailedAward.ImgPath} />
					<p class='flex-item'><b>Type:</b> ${this.detailedAward.Type}</p>
					<p class='flex-item'><b>Credits:</b> ${this.detailedAward.Credits}</p>
					<p class='flex-item'><b>Description:</b> ${this.detailedAward.Description}</p>
					<p class='flex-item'><b>Evidence:</b> ${this.detailedAward.Evidence}</p>
					<p class='flex-item'><b>Issue Date:</b> ${convertToDateString(this.detailedAward.IssueDate)}</p>
					<p class='flex-item'><b>Expiration Date:</b> ${convertToDateString(this.detailedAward.ExpirationDate)}</p>
					<d2l-button-subtle
						class='flex-item'
						text='Print'
						icon='tier1:print'
						@click='${this._getPrintHandler(this.detailedAward.Id)}'
						>
					</d2l-button-subtle>
					<d2l-button-subtle
						class='flex-item'
						text='Share on Badgr'
						icon='tier1:share'
						@click='${this._getShareHandler(this.detailedAward.Id)}'
						>
					</d2l-button-subtle>
				</div>
			</d2l-dialog>
			` : html``;
	}

	render() {
		return html`
		${this._renderComponentHeader()}
		${this._renderTable()}
		${this._renderAwardPopup()}
		`;
	}
}

customElements.define('d2l-my-awards', MyAwards);
