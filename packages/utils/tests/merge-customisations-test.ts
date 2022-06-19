import { defaultIconCustomisations } from '../lib/customisations/defaults';
import { mergeCustomisations } from '../lib/customisations/merge';

describe('Testing mergeCustomisations', () => {
	test('Empty', () => {
		expect(mergeCustomisations(defaultIconCustomisations, {})).toEqual(
			defaultIconCustomisations
		);
	});

	test('Flip', () => {
		expect(
			mergeCustomisations(defaultIconCustomisations, {
				hFlip: true,
			})
		).toEqual({
			...defaultIconCustomisations,
			hFlip: true,
		});
	});

	test('Excessive rotation', () => {
		expect(
			mergeCustomisations(defaultIconCustomisations, {
				rotate: 10,
			})
		).toEqual({
			...defaultIconCustomisations,
			rotate: 2,
		});
	});

	test('Dimensions', () => {
		expect(
			mergeCustomisations(defaultIconCustomisations, {
				width: '1em',
				height: 20,
			})
		).toEqual({
			...defaultIconCustomisations,
			width: '1em',
			height: 20,
		});
	});
});
