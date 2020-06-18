import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/inputs/input-search';
import '@brightspace-ui/core/components/inputs/input-checkbox';
import '@brightspace-ui/core/components/inputs/input-text';
import { selectStyles} from '@brightspace-ui/core/components/inputs/input-select-styles';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { awardsTableStyles } from '../styles/awards-table-styles';

class CourseAwards extends BaseMixin(LitElement) {
	static get properties() {
		return {
			awards: { type: Object }
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
			d2l-button {
				padding: 5px;
				float: right;
			}
			d2l-input-search {
				width: 60%;
				padding: 5px;
			}
			d2l-input-checkbox {
				padding: 5px;
			}
			#input-select-div {
				padding-top: 1rem;
				padding-bottom: 1rem;
			}
		`];
	}

	constructor() {
		super();
		this.enableEditing = false;
		this.awards = [
			{
				id: "123",
				name: "exampleAward",
				imgPath: "../../images/example_award.png",
				type: 'Badge',
				credits: 5,
				hiddenUntilEarned: false,
				doShow: true,
				enableEditing: false
			},
			{
				id: "456",
				name: "testAward",
				imgPath: "../../images/example_award.png",
				type: 'Certificate',
				credits: 2,
				hiddenUntilEarned: false,
				doShow: true,
				enableEditing: false
			}
		]
	}

	handleSearchEvent(event) {
		const { detail: { value: q } } = event;

		// replace with API call
		this.awards.forEach(award => award.doShow = award.name.toUpperCase().includes(q.toUpperCase()));
		this.requestUpdate();
	}

	handleBadgrUpdate(event) {
		console.log('TODO: Support Badgr'); // call API
	}

	addAwardToCourse() {
		console.log('TODO: Add award to course'); // call API
	}

	getEditAwardHandler(awardId) {
		return () => {
			const award = this.awards.find(award => award.id === awardId);
			if (award.enableEditing) { // we are finishing editing
				console.log(`TODO: Update award with id: ${award.id}`); // call API
			}
			award.enableEditing = !award.enableEditing;
			this.requestUpdate();
		}
	}

	getDeleteAwardHandler(awardId) {
		return () => {
			console.log(`TODO: Delete award with id: ${awardId}`); // call API
		}
	}

	handleAwardTypeSelection(event) {
		const { target: { value: q } } = event;
		console.log(q);

		// reaplce with API call
		this.awards.forEach(award =>
			award.doShow = q === 'All Awards' || award.type.toUpperCase() === q.toUpperCase().substring(0, q.length - 1));
		this.requestUpdate();
	}

	renderHeader() {
		return html`
		<d2l-input-checkbox
			@change="${this.handleBadgrUpdate}"
		>Allow users in this course to send earned awards to Badgr Backpack</d2l-input-checkbox>
		<div id="search_and_add">
			<d2l-input-search
				label="Search for course awards"
				placeholder="Search for course awards"
				@d2l-input-search-searched="${this.handleSearchEvent}">
			</d2l-input-search>
			<d2l-button
				text="Add Award to Course"
				aria-label="Add Award to Course"
				primary
				@click="${this.addAwardToCourse}"
			>Add Award to Course</d2l-button>
		</div>
		`;
	}

	renderTable(type) {
		const renderedAwards = this.awards && this.awards.filter(award => award.doShow).map(award => this.renderAward(award));
		return renderedAwards.length !== 0 ?
			html`
				<table aria-label="${type} table">
					<thead>
						<tr>
							<th id="award_icon" class="centered_column">Icon</th>
							<th>Name</th>
							<th>Type</th>
							<th>Credits</th>
							<th>Hidden Until Earned</th>
							<th class="centered_column">Edit</th>
							<th class="centered_column">Delete</th>
						</tr>
					</thead>
					<tbody>
						${renderedAwards}
					</tbody>
				</table>
			` :
			html`<p>No awards found</p>`;
	}

	getCreditsElement(award) {
		return award.enableEditing ?
			html`
				<d2l-input-text label-hidden
					title="Credits"
					label="Credits"
					placeholder="0.0"
					value="${award.credits}"
					size=1
				></d2l-input-text>` :
			html`
				<p>${award.credits}</p>
			`;
	}

	getHiddenAwardElement(award) {
		return award.enableEditing ?
			html`
				<d2l-input-checkbox
					class="hidden_checkbox"
					?checked=${award.hiddenUntilEarned}>
				</d2l-input-checkbox>` :
			html`
				<d2l-button-icon
					text=${award.hiddenUntilEarned ? "Hidden" : "Not Hidden"}
					icon=${award.hiddenUntilEarned ? "tier1:check" : "tier1:close-default"}>
				</d2l-button-icon>
			`;
	}

	renderAward(award) {
		return html`
			<tr>
				<td class="centered_column award_icon">
					<img src="${award.imgPath}", width="50%">
				</td>
				<td>${award.name}</td>
				<td>${award.type}</td>
				<td>
					${this.getCreditsElement(award)}
				</td>
				<td class="centered_column">
					${this.getHiddenAwardElement(award)}
				</td>
				<td class="centered_column">
					<d2l-button-icon
						text=${award.enableEditing ? `Finish editing award ${award.name}` : `Edit award ${award.name}`}
						icon=${award.enableEditing ? `tier1:save` : `tier1:edit`}
						@click="${this.getEditAwardHandler(award.id)}">
					</d2l-button-icon>
				</td>
				<td class="centered_column">
					<d2l-button-icon
						text="Delete Award"
						icon="tier1:delete"
						@click="${this.getDeleteAwardHandler(award.id)}">
					</d2l-button-icon>
				</td>
			</tr>
		`;
	}

	render() {
		return html`
			${this.renderHeader()}
			<div id="input-select-div">
				<select class="d2l-input-select" aria-label="Awards Type Dropdown" @change="${this.handleAwardTypeSelection}">
					<option>All Awards</option>
					<option>Badges</option>
					<option>Certificates</option>
				</select>
			</div>
			${this.renderTable()}
		`;
	}
}
customElements.define('d2l-course-awards', CourseAwards);
