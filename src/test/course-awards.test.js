import '../components/course-awards.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const ORG_UNIT_ID = 6606;
const COURSE_ORG_UNIT_ID = 6609;

describe('d2l-course-awards', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-course-awards></d2l-course-awards>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-course-awards');
		});
	});

	describe('create with different properties', () =>{
		it('with course enabled', () => {

		});
		it('without course enabled', () => {

		});

	})

});
