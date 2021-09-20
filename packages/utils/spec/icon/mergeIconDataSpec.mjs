import { mergeIconData } from '@iconify/utils/lib/icon/merge';

describe('Testing merging icon data', () => {
	it('Test', () => {
		// Nothing to merge
		const icon = {
			body: '<g />',
		};
		const expected = {
			body: '<g />',
		};
		// Check hint manually: supposed to be IconifyIcon
		const result = mergeIconData(icon, {});
		expect(result).toEqual(expected);

		// TypeScript full icon test
		const icon2 = {
			body: '<g />',
			width: 24,
			height: 24,
			left: 0,
			top: 0,
			rotate: 0,
			hFlip: false,
			vFlip: false,
		};
		const expected2 = {
			body: '<g />',
			width: 24,
			height: 24,
			left: 0,
			top: 0,
			rotate: 0,
			hFlip: false,
			vFlip: false,
		};
		// Check hint manually: supposed to be Required<IconifyIcon>
		const result2 = mergeIconData(icon2, {});
		expect(result2).toEqual(expected2);

		// Copy values
		expect(
			mergeIconData(
				{
					body: '<g />',
					width: 24,
				},
				{
					height: 32,
				}
			)
		).toEqual({
			body: '<g />',
			width: 24,
			height: 32,
		});

		// Override values
		expect(
			mergeIconData(
				{
					body: '<g />',
					width: 24,
					height: 24,
				},
				{
					height: 32,
				}
			)
		).toEqual({
			body: '<g />',
			width: 24,
			height: 32,
		});
	});
});
