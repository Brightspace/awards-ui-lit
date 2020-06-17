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
				name: "exampleAward",
				imgPath: "../../images/example_award.png",
				type: 'Badge',
				credits: 5,
				hidden: false,
				conditions: "example condition?"
			}
		]
	}

	toggleEditing() {
		console.log('clicked');
		this.enableEditing = !this.enableEditing;
		console.log(this.enableEditing);
	}

	renderHeader() {
		return html`
		<d2l-input-checkbox>Allow users in this course to send earned awards to Badgr Backpack</d2l-input-checkbox>
		<div id="search_and_add">
			<div class="search_add_wrapper">
				<d2l-input-search
					label="Search for course awards"
					placeholder="Search for course awards">
				</d2l-input-search>
			</div>
			<div class="search_add_wrapper">
				<d2l-button primary>Add Award to Course</d2l-button>
			</div>
		</div>
		`;
	}

	renderTable(type) {
		return html`
			<h2>
				Awards
				<d2l-button-icon
					text="Edit"
					aria-label="Edit"
					icon="tier1:edit"
					@click="${this.toggleEditing}">
				</d2l-button-icon>
			</h2>
			<table aria-label="${type} table">
				<thead>
					<tr>
						<th id="award_icon" class="centered_column">Icon</th>
						<th>Name</th>
						<th>Type</th>
						<th>Credits</th>
						<th>Hidden Until Earned</th>
						<th>Conditions</th>
						<th id="delete" class="centered_column">Delete</th>
					</tr>
				</thead>
				<tbody>
					${this.awards && this.awards.map(award => this.renderAward(award))}
				</tbody>
			</table>
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
					<d2l-input-text label-hidden
						?disabled=${!this.enableEditing}
						title="Credits"
						label="Credits"
						placeholder="0.0"
						value="${award.credits}"
						size=4
					></d2l-input-text>
				</td>
				<td class="centered_column">
					<d2l-input-checkbox
						?disabled=${!this.enableEditing}
						class="hidden_checkbox"
						?checked=${award.hidden}>
					</d2l-input-checkbox>
				</td>
				<td>${award.conditions}</td>
				<td class="centered_column">
					<d2l-button-icon text="Delete" icon="tier1:delete"></d2l-button-icon>
				</td>
			</tr>
		`;
	}

	render() {
		return html`
		${this.renderHeader()}
		${this.renderTable('Badges')}
		`;
	}
}
customElements.define('d2l-course-awards', CourseAwards);
