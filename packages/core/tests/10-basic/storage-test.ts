/* eslint-disable @typescript-eslint/ban-ts-ignore */
import 'mocha';
import { expect } from 'chai';
import {
	newStorage,
	addIcon,
	iconExists,
	getIcon,
	addIconSet,
} from '../../lib/storage';
import { FullIconifyIcon, IconifyIcon } from '../../lib/icon';
import { IconifyJSON } from '@iconify/types';

describe('Testing storage', () => {
	it('Adding icon', () => {
		const storage = newStorage('foo');

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
		const storage = newStorage('foo');

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

	it('Icon set with invalid default values', () => {
		const storage = newStorage('foo');

		// Missing prefix, invalid default values
		expect(
			addIconSet(storage, ({
				icons: {
					icon1: {
						body: '<path d="icon1" />',
						width: 20,
						// Default should not override this
						height: 20,
					},
					icon2: {
						body: '<path d="icon2" />',
						width: 24,
					},
					icon3: {
						// Missing 'body'
						width: 24,
					},
				},
				height: 24,
				// Objects should be ignored. Not testing other types because validation is done only for objects
				rotate: {
					foo: 1,
				},
				hFlip: null,
			} as unknown) as IconifyJSON)
			// Should return false because of exception, but still add icon1 and icon2 before failing on icon3
		).to.be.equal(false);

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
			height: 20,
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

	it('Icon set with simple aliases', () => {
		const storage = newStorage('foo');

		expect(
			addIconSet(storage, {
				prefix: 'foo',
				icons: {
					icon1: {
						body: '<path d="icon1" />',
						width: 20,
						height: 20,
					},
					icon2: {
						body: '<path d="icon2" />',
						width: 24,
						rotate: 1,
						hFlip: true,
					},
				},
				aliases: {
					alias1: {
						parent: 'icon1',
					},
					alias2: {
						parent: 'icon2',
						rotate: 1,
						hFlip: true,
						vFlip: true,
					},
					alias3: {
						parent: 'icon3',
					},
				},
				height: 24,
			})
		).to.be.equal(true);

		expect(Object.keys(storage.icons)).to.be.eql([
			'icon1',
			'icon2',
			'alias1',
			'alias2',
		]);

		// Test getIcon
		let expected: FullIconifyIcon = {
			body: '<path d="icon1" />',
			width: 20,
			height: 20,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: false,
			rotate: 0,
		};
		expect(getIcon(storage, 'alias1')).to.be.eql(expected);
		expected = {
			body: '<path d="icon2" />',
			width: 24,
			height: 24,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: true,
			rotate: 2,
		};
		expect(getIcon(storage, 'alias2')).to.be.eql(expected);
		expect(getIcon(storage, 'alias3')).to.be.equal(null);
	});

	it('Icon set with nested aliases', () => {
		const storage = newStorage('foo');

		expect(
			addIconSet(storage, {
				prefix: 'foo',
				icons: {
					icon1: {
						body: '<path d="icon1" />',
						width: 20,
						height: 20,
					},
					icon2: {
						body: '<path d="icon2" />',
						width: 24,
						rotate: 1,
						hFlip: true,
					},
				},
				aliases: {
					alias2a: {
						// Alias before parent
						parent: 'alias2f',
						width: 20,
						height: 20,
					},
					alias2f: {
						parent: 'icon2',
						width: 22,
						rotate: 1,
						hFlip: true,
						vFlip: true,
					},
					alias2z: {
						// Alias after parent
						parent: 'alias2f',
						width: 21,
						rotate: 3,
					},
					alias2z3: {
						// 3 parents: alias2z, alias2f, icon2
						parent: 'alias2z',
					},
					alias2z4: {
						// 4 parents: alias2z3, alias2z, alias2f, icon2
						parent: 'alias2z3',
					},
				},
				height: 24,
			})
			// Should have thrown exception on 'alias2z4'
		).to.be.equal(false);

		expect(Object.keys(storage.icons)).to.be.eql([
			'icon1',
			'icon2',
			'alias2a',
			'alias2f',
			'alias2z',
			'alias2z3',
		]);

		// Test icon
		let expected: FullIconifyIcon = {
			body: '<path d="icon2" />',
			width: 24,
			height: 24,
			top: 0,
			left: 0,
			hFlip: true,
			vFlip: false,
			rotate: 1,
		};
		expect(getIcon(storage, 'icon2')).to.be.eql(expected);

		// Test simple alias
		expected = {
			body: '<path d="icon2" />',
			width: 22,
			height: 24,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: true,
			rotate: 2,
		};
		expect(getIcon(storage, 'alias2f')).to.be.eql(expected);

		// Test nested aliases
		expected = {
			body: '<path d="icon2" />',
			width: 21,
			height: 24,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: true,
			rotate: 1, // 5
		};
		expect(getIcon(storage, 'alias2z')).to.be.eql(expected);

		expected = {
			body: '<path d="icon2" />',
			width: 20,
			height: 20,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: true,
			rotate: 2,
		};
		expect(getIcon(storage, 'alias2a')).to.be.eql(expected);

		// 3 levels
		expected = {
			body: '<path d="icon2" />',
			width: 21,
			height: 24,
			top: 0,
			left: 0,
			hFlip: false,
			vFlip: true,
			rotate: 1, // 5
		};
		expect(getIcon(storage, 'alias2z3')).to.be.eql(expected);
	});

	it('Icon set with aliases that use transformations', () => {
		const storage = newStorage('arty-animated');
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
});
