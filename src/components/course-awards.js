import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/inputs/input-search';
import '@brightspace-ui/core/components/inputs/input-checkbox';
import '@brightspace-ui/core/components/inputs/input-text';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { awardsTableStyles } from '../styles/awards-table-styles';

class CourseAwards extends BaseMixin(LitElement) {
	static get properties() {
		return {
			enableEditing: { type: Boolean },
			awards: { type: Object }
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
			d2l-button {
				width: 200px;
				padding: 5px;
			}
			d2l-input-search {
				width: 525px;
				padding: 5px;
			}
			d2l-input-checkbox {
				padding: 5px;
			}
			.search_add_wrapper {
				display: inline-block;
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
				doShow: true
			}
		]
	}

	handleSearch(event) {
		const { detail: { value: q } } = event;
		this.awards.forEach(award => award.doShow = award.name.includes(q));
		this.requestUpdate();
	}

	handleBadgrUpdate(event) {
		console.log('TODO: Support Badgr');
	}

	addAwardToCourse() {
		console.log('TODO: Add award to course');
	}

	editAward(event) { // it doesn't seem possible to determine which button was pressed... maybe a closure with the award id stored?
		console.log(event);
		if (this.enableEditing) { // we are finishing editing
			console.log(`TODO: Update award: ${JSON.stringify(event.relatedTarget)}`)
		}
		this.enableEditing = !this.enableEditing;
	}

	deleteAward() {
		console.log('TODO: delete award');
	}

	renderHeader() {
		return html`
		<d2l-input-checkbox
			@change="${this.handleBadgrUpdate}"
		>Allow users in this course to send earned awards to Badgr Backpack</d2l-input-checkbox>
		<div id="search_and_add">
			<div class="search_add_wrapper">
				<d2l-input-search
					label="Search for course awards"
					placeholder="Search for course awards"
					@d2l-input-search-searched="${this.handleSearch}">
				</d2l-input-search>
			</div>
			<div class="search_add_wrapper">
				<d2l-button
					text="Add Award to Course"
					aria-label="Add Award to Course"
					primary
					@click="${this.addAwardToCourse}"
				>Add Award to Course</d2l-button>
			</div>
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
		return this.enableEditing ?
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
		return this.enableEditing ?
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
						text=${this.enableEditing ? "Finish editing award" : "Edit award"}
						icon=${this.enableEditing ? "tier1:save" : "tier1:edit"}
						id="${award.id}"
						@click="${this.editAward}">
					</d2l-button-icon>
				</td>
				<td class="centered_column">
					<d2l-button-icon
						text="Delete Award"
						icon="tier1:delete"
						@click="${this.deleteAward}">
					</d2l-button-icon>
				</td>
			</tr>
		`;
	}

	render() {
		return html`
			${this.renderHeader()}
			<h2>Awards</h2>
			${this.renderTable()}
		`;
	}
}
customElements.define('d2l-course-awards', CourseAwards);
