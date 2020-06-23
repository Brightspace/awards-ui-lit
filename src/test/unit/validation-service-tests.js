import { expect } from 'chai';
import { ValidationService } from '../../services/validation-service';

describe('ValidationService', () => {
	describe('isNonNegativeNumber', () => {
		it('should be false when undefined', () => {
			expect(ValidationService.isNonNegativeNumber()).to.be.false;
		});

		it('should be false when null', () => {
			expect(ValidationService.isNonNegativeNumber(null)).to.be.false;
		});

		it('should be false when empty', () => {
			expect(ValidationService.isNonNegativeNumber('')).to.be.false;
		});

		it('should be false when not a number', () => {
			expect(ValidationService.isNonNegativeNumber('test')).to.be.false;
		});

		it('should be false when negative integer', () => {
			expect(ValidationService.isNonNegativeNumber('-1')).to.be.false;
		});

		it('should be false when negative real number', () => {
			expect(ValidationService.isNonNegativeNumber('-1.22')).to.be.false;
		});

		it('should be false when negative real number with no leading integer', () => {
			expect(ValidationService.isNonNegativeNumber('-.22')).to.be.false;
		});

		it('should be true when non-negative integer', () => {
			expect(ValidationService.isNonNegativeNumber('1')).to.be.true;
		});

		it('should be true when non-negative real number', () => {
			expect(ValidationService.isNonNegativeNumber('1.22')).to.be.true;
		});

		it('should be true when non-negative real number with no leading integer', () => {
			expect(ValidationService.isNonNegativeNumber('.22')).to.be.true;
		});
	});

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
