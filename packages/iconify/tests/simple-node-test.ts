import { readFileSync } from 'fs';
import { dirname } from 'path';
import Iconify, { IconifyIcon } from '../dist/iconify';

describe('Testing Iconify with Node.js', () => {
	it('Basic functions', () => {
		expect(typeof Iconify).toBe('object');

		// Placeholder value should have been replaced during compilation
		const version = JSON.parse(
			readFileSync(dirname(__dirname) + '/package.json', 'utf8')
		).version;
		expect(Iconify.getVersion()).toBe(version);
	});

	it('Builder functions', () => {
		// calculateSize() should work in Node.js
		expect(Iconify.calculateSize('24px', 2)).toBe('48px');

		// replaceIDs() should work in Node.js
		const test = '<div id="foo" />';
		expect(Iconify.replaceIDs(test)).not.toBe(test);
	});

	it('Storage functions', () => {
		const prefix = 'node-test-storage';
		const name = prefix + ':bar';

		// Empty results
		expect(Iconify.iconExists(name)).toBe(false);
		expect(Iconify.getIcon(name)).toBeNull();
		expect(Iconify.listIcons('', prefix)).toEqual([]);

		// Test addIcon()
		expect(
			Iconify.addIcon(name, {
				body: '<g />',
				width: 24,
				height: 24,
			})
		).toBe(true);

		expect(Iconify.iconExists(name)).toBe(true);
		const expected: Required<IconifyIcon> = {
			body: '<g />',
			width: 24,
			height: 24,
			left: 0,
			top: 0,
			hFlip: false,
			vFlip: false,
			rotate: 0,
		};
		expect(Iconify.getIcon(name)).toEqual(expected);
		expect(Iconify.listIcons('', prefix)).toEqual([name]);

		// Test addCollection()
		expect(
			Iconify.addCollection({
				prefix,
				icons: {
					test1: {
						body: '<g />',
					},
				},
				width: 24,
				height: 24,
			})
		).toBe(true);
		expect(Iconify.listIcons('', prefix)).toEqual([
			name,
			prefix + ':test1',
		]);
	});
});
