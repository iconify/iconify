import 'mocha';
import { expect } from 'chai';
import { calcSize } from '../../lib/builder/calc-size';

describe('Testing calcSize', () => {
	it('Simple size', () => {
		const width = 36;
		const height = 48;

		// Get width from height and height from width
		expect(calcSize('48', width / height)).to.be.equal('36');
		expect(calcSize('36', height / width)).to.be.equal('48');

		expect(calcSize(48, width / height)).to.be.equal(36);
		expect(calcSize(36, height / width)).to.be.equal(48);
	});

	it('Numbers', () => {
		const width = 36;
		const height = 48;

		// Simple numbers
		expect(calcSize(24, width / height)).to.be.equal(18);
		expect(calcSize(30, width / height)).to.be.equal(22.5);
		expect(calcSize(99, width / height)).to.be.equal(74.25);

		// Rounding numbers
		expect(calcSize(100 / 3, height / width)).to.be.equal(44.45);
		expect(calcSize(11.1111111, width / height)).to.be.equal(8.34);
		expect(calcSize(11.1111111, width / height, 1000)).to.be.equal(8.334);
	});

	it('Strings', () => {
		const width = 36;
		const height = 48;

		// Simple units
		expect(calcSize('48px', width / height)).to.be.equal('36px');
		expect(calcSize('24%', width / height)).to.be.equal('18%');
		expect(calcSize('1em', width / height)).to.be.equal('0.75em');

		// Add space
		expect(calcSize('24 Pixels', width / height)).to.be.equal('18 Pixels');

		// Multiple sets of numbers
		expect(calcSize('48% + 5em', width / height)).to.be.equal(
			'36% + 3.75em'
		);
		expect(calcSize('calc(1em + 8px)', height / width)).to.be.equal(
			'calc(1.34em + 10.67px)'
		);
		expect(calcSize('-webkit-calc(1em + 8px)', width / height)).to.be.equal(
			'-webkit-calc(0.75em + 6px)'
		);

		// Invalid strings
		expect(calcSize('-.', width / height)).to.be.equal('-.');
		expect(calcSize('@foo', width / height)).to.be.equal('@foo');
	});
});
