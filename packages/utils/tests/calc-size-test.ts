import 'mocha';
import { expect } from 'chai';
import { calculateSize } from '../lib/svg/size';

describe('Testing calcSize', () => {
	it('Simple size', () => {
		const width = 36;
		const height = 48;

		// Get width from height and height from width
		expect(calculateSize('48', width / height)).to.be.equal('36');
		expect(calculateSize('36', height / width)).to.be.equal('48');

		expect(calculateSize(48, width / height)).to.be.equal(36);
		expect(calculateSize(36, height / width)).to.be.equal(48);
	});

	it('Numbers', () => {
		const width = 36;
		const height = 48;

		// Simple numbers
		expect(calculateSize(24, width / height)).to.be.equal(18);
		expect(calculateSize(30, width / height)).to.be.equal(22.5);
		expect(calculateSize(99, width / height)).to.be.equal(74.25);

		// Rounding numbers
		expect(calculateSize(100 / 3, height / width)).to.be.equal(44.45);
		expect(calculateSize(11.1111111, width / height)).to.be.equal(8.34);
		expect(calculateSize(11.1111111, width / height, 1000)).to.be.equal(
			8.334
		);
	});

	it('Strings', () => {
		const width = 36;
		const height = 48;

		// Simple units
		expect(calculateSize('48px', width / height)).to.be.equal('36px');
		expect(calculateSize('24%', width / height)).to.be.equal('18%');
		expect(calculateSize('1em', width / height)).to.be.equal('0.75em');

		// Add space
		expect(calculateSize('24 Pixels', width / height)).to.be.equal(
			'18 Pixels'
		);

		// Multiple sets of numbers
		expect(calculateSize('48% + 5em', width / height)).to.be.equal(
			'36% + 3.75em'
		);
		expect(calculateSize('calc(1em + 8px)', height / width)).to.be.equal(
			'calc(1.34em + 10.67px)'
		);
		expect(
			calculateSize('-webkit-calc(1em + 8px)', width / height)
		).to.be.equal('-webkit-calc(0.75em + 6px)');

		// Invalid strings
		expect(calculateSize('-.', width / height)).to.be.equal('-.');
		expect(calculateSize('@foo', width / height)).to.be.equal('@foo');
	});
});
