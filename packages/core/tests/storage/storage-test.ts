/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	newStorage,
	addIconToStorage,
	iconExists,
	addIconSet,
	getStorage,
	listIcons,
} from '../../lib/storage/storage';
import type { IconifyIcon, FullIconifyIcon } from '@iconify/utils/lib/icon';

describe('Testing storage', () => {
	it('Adding icon', () => {
		const storage = newStorage('', 'foo');

		// Add one icon
		addIconToStorage(storage, 'test', {
			body: '<path d="" />',
			width: 20,
			height: 16,
		});
		addIconToStorage(storage, 'not-really-missing', {
			body: '<path d="" />',
			width: 24,
			height: 24,
		});

		// Add another icon with reserved keyword as name
		addIconToStorage(storage, 'constructor', {
			body: '<g></g>',
			width: 24,
			height: 24,
			rotate: 1,
		});

		// Mark 'not-really-missing' as missing
		storage.missing['not-really-missing'] = Date.now();

		// Add invalid icon
		addIconToStorage(storage, 'invalid', {} as unknown as IconifyIcon);

		// Should not include 'invalid'
		expect(Object.keys(storage.icons)).toEqual([
			'test',
			'not-really-missing',
			'constructor',
		]);

		// Test iconExists
		expect(iconExists(storage, 'test')).toBe(true);
		expect(iconExists(storage, 'constructor')).toBe(true);
		expect(iconExists(storage, 'invalid')).toBe(false);
		expect(iconExists(storage, 'missing')).toBe(false);
		expect(iconExists(storage, 'not-really-missing')).toBe(true);

		// Test getIcon
		let expected: FullIconifyIcon = {
			body: '<path d="" />',
			width: 20,
			height: 16,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: false,
			rotate: 0,
		};
		const icon = storage.icons['test'];
		expect(icon).toEqual(expected);

		// Test icon mutation
		let thrown = false;
		try {
			// @ts-ignore
			icon.width = 12;
		} catch (err) {
			thrown = true;
		}
		expect(thrown).toBe(true);

		expected = {
			body: '<g></g>',
			width: 24,
			height: 24,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: false,
			rotate: 1,
		};
		expect(storage.icons['constructor']).toEqual(expected);

		expect(storage.icons['invalid']).toBeUndefined();
	});

	it('Adding simple icon set', () => {
		const storage = newStorage('', 'foo');

		// Add two icons
		expect(
			addIconSet(storage, {
				prefix: 'foo',
				icons: {
					icon1: {
						body: '<path d="icon1" />',
						width: 20,
					},
					icon2: {
						body: '<path d="icon2" />',
						width: 24,
					},
				},
				height: 24,
			})
		).toEqual(['icon1', 'icon2']);

		expect(Object.keys(storage.icons)).toEqual(['icon1', 'icon2']);

		// Test iconExists
		expect(iconExists(storage, 'icon1')).toBe(true);
		expect(iconExists(storage, 'icon2')).toBe(true);
		expect(iconExists(storage, 'invalid')).toBe(false);
		expect(iconExists(storage, 'missing')).toBe(false);

		// Test getIcon
		let expected: FullIconifyIcon = {
			body: '<path d="icon1" />',
			width: 20,
			height: 24,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: false,
			rotate: 0,
		};
		expect(storage.icons['icon1']).toEqual(expected);
		expected = {
			body: '<path d="icon2" />',
			width: 24,
			height: 24,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: false,
			rotate: 0,
		};
		expect(storage.icons['icon2']).toEqual(expected);
	});

	it('Icon set with aliases that use transformations', () => {
		const storage = newStorage('iconify', 'arty-animated');
		const iconBody =
			'<g stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" fill-rule="evenodd"><path d="M40 64l48-48" class="animation-delay-0 animation-duration-10 animate-stroke stroke-length-102"/><path d="M40 64l48 48" class="animation-delay-0 animation-duration-10 animate-stroke stroke-length-102"/></g>';

		expect(
			addIconSet(storage, {
				prefix: 'arty-animated',
				icons: {
					'16-chevron-left': {
						body: iconBody,
					},
				},
				aliases: {
					'16-chevron-right': {
						parent: '16-chevron-left',
						hFlip: true,
					},
				},
				width: 128,
				height: 128,
			})
		).toEqual(['16-chevron-left', '16-chevron-right']);

		expect(Object.keys(storage.icons)).toEqual([
			'16-chevron-left',
			'16-chevron-right',
		]);

		// Test icon
		let expected: FullIconifyIcon = {
			body: iconBody,
			width: 128,
			height: 128,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: false,
			rotate: 0,
		};
		expect(storage.icons['16-chevron-left']).toEqual(expected);

		// Test alias
		expected = {
			body: iconBody,
			width: 128,
			height: 128,
			top: 0,
			left: 0,
			hFlip: true,
			vFlip: false,
			rotate: 0,
		};
		expect(storage.icons['16-chevron-right']).toEqual(expected);
	});

	it('List icons in a global storage', () => {
		const provider = 'test-provider';
		const prefix = 'global-storage-test';
		const storage1 = getStorage('', prefix);
		const storage2 = getStorage(provider, prefix);

		// List icons
		expect(listIcons('', prefix)).toEqual([]);
		expect(listIcons(provider, prefix)).toEqual([]);

		// Add one icon without provider
		addIconToStorage(storage1, 'test', {
			body: '<path d="" />',
			width: 20,
			height: 16,
		});

		// List icons
		expect(listIcons('', prefix)).toEqual([prefix + ':test']);
		expect(listIcons(provider, prefix)).toEqual([]);

		// Add icon set without provider
		expect(
			addIconSet(storage1, {
				prefix,
				icons: {
					'16-chevron-left': {
						body: '<path d="" />',
					},
				},
				aliases: {
					'16-chevron-right': {
						parent: '16-chevron-left',
						hFlip: true,
					},
				},
				width: 128,
				height: 128,
			})
		).toEqual(['16-chevron-left', '16-chevron-right']);

		// List icons
		expect(listIcons('', prefix)).toEqual([
			prefix + ':test',
			prefix + ':16-chevron-left',
			prefix + ':16-chevron-right',
		]);
		expect(listIcons(provider, prefix)).toEqual([]);

		// Add one icon with provider
		addIconToStorage(storage2, 'test2', {
			body: '<path d="" />',
			width: 20,
			height: 16,
		});

		// List icons
		expect(listIcons('', prefix)).toEqual([
			prefix + ':test',
			prefix + ':16-chevron-left',
			prefix + ':16-chevron-right',
		]);
		expect(listIcons(provider, prefix)).toEqual([
			'@' + provider + ':' + prefix + ':test2',
		]);
	});
});
