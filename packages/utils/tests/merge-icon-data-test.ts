import 'mocha';
import { expect } from 'chai';
import { mergeIconData } from '../lib/icon/merge';
import type { IconifyIcon } from '@iconify/types';

describe('Testing merging icon data', () => {
	it('Test', () => {
		// Nothing to merge
		const icon: IconifyIcon = {
			body: '<g />',
		};
		const expected: IconifyIcon = {
			body: '<g />',
		};
		// Check hint manually: supposed to be IconifyIcon
		const result = mergeIconData(icon, {});
		expect(result).to.be.eql(expected);

		// TypeScript full icon test
		const icon2: Required<IconifyIcon> = {
			body: '<g />',
			width: 24,
			height: 24,
			left: 0,
			top: 0,
			rotate: 0,
			hFlip: false,
			vFlip: false,
		};
		const expected2: Required<IconifyIcon> = {
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
		expect(result2).to.be.eql(expected2);

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
		).to.be.eql({
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
		).to.be.eql({
			body: '<g />',
			width: 24,
			height: 32,
		});
	});
});
