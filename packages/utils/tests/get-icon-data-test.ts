import 'mocha';
import { expect } from 'chai';
import { getIconData } from '../lib/icon-set';

describe('Testing getting icon data', () => {
	it('Simple icon', () => {
		// Short icon
		const result1 = getIconData(
			{
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
						width: 24,
					},
				},
			},
			'bar',
			false
		);
		expect(result1).to.be.eql({
			body: '<g />',
			width: 24,
		});

		// Full icon
		const result2 = getIconData(
			{
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
						width: 24,
					},
				},
			},
			'bar',
			true
		);
		expect(result2).to.be.eql({
			body: '<g />',
			left: 0,
			top: 0,
			width: 24,
			height: 16,
			rotate: 0,
			vFlip: false,
			hFlip: false,
		});
	});
});
