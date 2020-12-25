/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'mocha';
import { expect } from 'chai';
import {
	newStorage,
	addIcon,
	iconExists,
	getIcon,
	addIconSet,
	getStorage,
	listIcons,
} from '../../lib/storage/storage';
import type { FullIconifyIcon, IconifyIcon } from '../../lib/icon';

describe('Testing storage', () => {
	it('Adding icon', () => {
		const storage = newStorage('', 'foo');

		// Add one icon
		addIcon(storage, 'test', {
			body: '<path d="" />',
			width: 20,
			height: 16,
		});

		// Add another icon with reserved keyword as name
		addIcon(storage, 'constructor', {
			body: '<g></g>',
			width: 24,
			height: 24,
			rotate: 1,
		});

		// Add invalid icon
		addIcon(storage, 'invalid', ({} as unknown) as IconifyIcon);

		// Should not include 'invalid'
		expect(Object.keys(storage.icons)).to.be.eql(['test', 'constructor']);

		// Test iconExists
		expect(iconExists(storage, 'test')).to.be.equal(true);
		expect(iconExists(storage, 'constructor')).to.be.equal(true);
		expect(iconExists(storage, 'invalid')).to.be.equal(false);
		expect(iconExists(storage, 'missing')).to.be.equal(false);

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
		const icon = getIcon(storage, 'test');
		expect(icon).to.be.eql(expected);
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

		// Test icon mutation
		let thrown = false;
		try {
			// @ts-ignore
			icon.width = 12;
		} catch (err) {
			thrown = true;
		}
		expect(thrown).to.be.equal(true);

		expect(getIcon(storage, 'constructor')).to.be.eql(expected);
		expect(getIcon(storage, 'invalid')).to.be.equal(null);
		expect(getIcon(storage, 'missing')).to.be.equal(null);
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
		).to.be.equal(true);

		expect(Object.keys(storage.icons)).to.be.eql(['icon1', 'icon2']);

		// Test iconExists
		expect(iconExists(storage, 'icon1')).to.be.equal(true);
		expect(iconExists(storage, 'icon2')).to.be.equal(true);
		expect(iconExists(storage, 'invalid')).to.be.equal(false);
		expect(iconExists(storage, 'missing')).to.be.equal(false);

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
		expect(getIcon(storage, 'icon1')).to.be.eql(expected);
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
		expect(getIcon(storage, 'icon2')).to.be.eql(expected);
		expect(getIcon(storage, 'invalid')).to.be.equal(null);
		expect(getIcon(storage, 'missing')).to.be.equal(null);
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
		).to.be.equal(true);

		expect(Object.keys(storage.icons)).to.be.eql([
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
		expect(getIcon(storage, '16-chevron-left')).to.be.eql(expected);

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
		expect(getIcon(storage, '16-chevron-right')).to.be.eql(expected);
	});

	it('List icons in a global storage', () => {
		const provider = 'test-provider';
		const prefix = 'global-storage-test';
		const storage1 = getStorage('', prefix);
		const storage2 = getStorage(provider, prefix);

		// List icons
		expect(listIcons('', prefix)).to.be.eql([]);
		expect(listIcons(provider, prefix)).to.be.eql([]);

		// Add one icon without provider
		addIcon(storage1, 'test', {
			body: '<path d="" />',
			width: 20,
			height: 16,
		});

		// List icons
		expect(listIcons('', prefix)).to.be.eql([prefix + ':test']);
		expect(listIcons(provider, prefix)).to.be.eql([]);

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
		).to.be.equal(true);

		// List icons
		expect(listIcons('', prefix)).to.be.eql([
			prefix + ':test',
			prefix + ':16-chevron-left',
			prefix + ':16-chevron-right',
		]);
		expect(listIcons(provider, prefix)).to.be.eql([]);

		// Add one icon with provider
		addIcon(storage2, 'test2', {
			body: '<path d="" />',
			width: 20,
			height: 16,
		});

		// List icons
		expect(listIcons('', prefix)).to.be.eql([
			prefix + ':test',
			prefix + ':16-chevron-left',
			prefix + ':16-chevron-right',
		]);
		expect(listIcons(provider, prefix)).to.be.eql([
			'@' + provider + ':' + prefix + ':test2',
		]);
	});
});
