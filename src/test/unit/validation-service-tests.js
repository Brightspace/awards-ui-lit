import { expect } from 'chai';
import { ValidationService } from '../../services/validation-service';

describe('ValidationService', () => {
	describe('stringNotEmpty', () => {
		it('should be false when undefined', () => {
			expect(ValidationService.stringNotEmpty()).to.be.false;
		});

		it('should be false when null', () => {
			expect(ValidationService.stringNotEmpty(null)).to.be.false;
		});

		it('should be false when empty', () => {
			expect(ValidationService.stringNotEmpty('')).to.be.false;
		});

		it('should be true when valid', () => {
			expect(ValidationService.stringNotEmpty('yes')).to.be.true;
		});
	});

	describe('optionSelected', () => {
		it('should be false when undefined', () => {
			expect(ValidationService.optionSelected()).to.be.false;
		});

		it('should be false when null', () => {
			expect(ValidationService.optionSelected(null)).to.be.false;
		});

		it('should be false when 0', () => {
			expect(ValidationService.optionSelected(0)).to.be.false;
		});

		it('should be true when valid', () => {
			expect(ValidationService.optionSelected(69)).to.be.true;
		});
	});
});
