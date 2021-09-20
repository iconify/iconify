import { calculateSize } from '@iconify/utils/lib/svg/size';

describe('Testing calcSize', () => {
	it('Simple size', () => {
		const width = 36;
		const height = 48;

		// Get width from height and height from width
		expect(calculateSize('48', width / height)).toEqual('36');
		expect(calculateSize('36', height / width)).toEqual('48');

		expect(calculateSize(48, width / height)).toEqual(36);
		expect(calculateSize(36, height / width)).toEqual(48);
	});

	it('Numbers', () => {
		const width = 36;
		const height = 48;

		// Simple numbers
		expect(calculateSize(24, width / height)).toEqual(18);
		expect(calculateSize(30, width / height)).toEqual(22.5);
		expect(calculateSize(99, width / height)).toEqual(74.25);

		// Rounding numbers
		expect(calculateSize(100 / 3, height / width)).toEqual(44.45);
		expect(calculateSize(11.1111111, width / height)).toEqual(8.34);
		expect(calculateSize(11.1111111, width / height, 1000)).toEqual(8.334);
	});

	it('Strings', () => {
		const width = 36;
		const height = 48;

		// Simple units
		expect(calculateSize('48px', width / height)).toEqual('36px');
		expect(calculateSize('24%', width / height)).toEqual('18%');
		expect(calculateSize('1em', width / height)).toEqual('0.75em');

		// Add space
		expect(calculateSize('24 Pixels', width / height)).toEqual('18 Pixels');

		// Multiple sets of numbers
		expect(calculateSize('48% + 5em', width / height)).toEqual(
			'36% + 3.75em'
		);
		expect(calculateSize('calc(1em + 8px)', height / width)).toEqual(
			'calc(1.34em + 10.67px)'
		);
		expect(
			calculateSize('-webkit-calc(1em + 8px)', width / height)
		).toEqual('-webkit-calc(0.75em + 6px)');

		// Invalid strings
		expect(calculateSize('-.', width / height)).toEqual('-.');
		expect(calculateSize('@foo', width / height)).toEqual('@foo');
	});
});
