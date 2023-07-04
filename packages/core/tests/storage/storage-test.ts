/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { IconifyIcon } from '@iconify/types';
import {
	newStorage,
	addIconToStorage,
	iconInStorage,
	addIconSet,
	getStorage,
	listIcons,
} from '../../lib/storage/storage';

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
		storage.missing.add('not-really-missing');

		// Add invalid icon
		addIconToStorage(storage, 'invalid', {} as unknown as IconifyIcon);

		// Should not include 'invalid'
		expect(Object.keys(storage.icons)).toEqual([
			'test',
			'not-really-missing',
			'constructor',
		]);

		// Test iconInStorage
		expect(iconInStorage(storage, 'test')).toBe(true);
		expect(iconInStorage(storage, 'constructor')).toBe(true);
		expect(iconInStorage(storage, 'invalid')).toBe(false);
		expect(iconInStorage(storage, 'missing')).toBe(false);
		expect(iconInStorage(storage, 'not-really-missing')).toBe(true);

		// Test getIcon
		let expected: IconifyIcon = {
			body: '<path d="" />',
			width: 20,
			height: 16,
		};
		const icon = storage.icons['test'];
		expect(icon).toEqual(expected);

		expected = {
			body: '<g></g>',
			width: 24,
			height: 24,
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

		// Test iconInStorage
		expect(iconInStorage(storage, 'icon1')).toBe(true);
		expect(iconInStorage(storage, 'icon2')).toBe(true);
		expect(iconInStorage(storage, 'invalid')).toBe(false);
		expect(iconInStorage(storage, 'missing')).toBe(false);

		// Test getIcon
		let expected: IconifyIcon = {
			body: '<path d="icon1" />',
			width: 20,
			height: 24,
		};
		expect(storage.icons['icon1']).toEqual(expected);
		expected = {
			body: '<path d="icon2" />',
			width: 24,
			height: 24,
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
		let expected: IconifyIcon = {
			body: iconBody,
			width: 128,
			height: 128,
		};
		expect(storage.icons['16-chevron-left']).toEqual(expected);

		// Test alias
		expected = {
			body: iconBody,
			width: 128,
			height: 128,
			hFlip: true,
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
