import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';
import { addIconSet, getStorage, listIcons } from '../../lib/storage/storage';
import {
	iconExists,
	getIcon,
	addIcon,
	addCollection,
	allowSimpleNames,
	getIconData,
} from '../../lib/storage/functions';

describe('Testing IconifyStorageFunctions', () => {
	let count = 0;

	function nextProvider(): string {
		return 'storage-test-' + (count++).toString();
	}

	beforeEach(() => {
		allowSimpleNames(false);
	});
	afterAll(() => {
		allowSimpleNames(false);
	});

	it('Storage functions', () => {
		const provider = nextProvider();
		const testName = `@${provider}:foo:bar`;

		// Empty
		expect(iconExists(testName)).toBe(false);
		expect(getIconData(testName)).toBeUndefined();
		expect(getIcon(testName)).toBeNull();
		expect(listIcons(provider)).toEqual([]);

		// Add and test one icon
		expect(
			addIcon(testName, {
				body: '<g />',
			})
		).toBe(true);
		expect(iconExists(testName)).toBe(true);
		expect(listIcons(provider)).toEqual([testName]);

		let expected = {
			body: '<g />',
		};
		expect(getIconData(testName)).toEqual(expected);
		expect(getIcon(testName)).toEqual({
			...defaultIconProps,
			...expected,
		});

		// Add icon set
		const prefix = 'prefix' + (count++).toString();
		const storage = getStorage('', prefix);
		addIconSet(storage, {
			prefix,
			icons: {
				home: {
					body: '<g id="home" />',
				},
			},
			not_found: ['missing'],
		});

		// Test 'home' icon
		expect(iconExists(`${prefix}:home`)).toBe(true);
		expected = {
			body: '<g id="home" />',
		};
		expect(getIconData(`${prefix}:home`)).toEqual(expected);
		expect(getIcon(`${prefix}:home`)).toEqual({
			...defaultIconProps,
			...expected,
		});

		// Test 'missing' icon
		expect(iconExists(`${prefix}:missing`)).toBe(false);
		expect(getIconData(`${prefix}:missing`)).toBeNull();
		expect(getIcon(`${prefix}:missing`)).toBeNull();

		// Test 'invalid' icon
		expect(iconExists(`${prefix}:invalid`)).toBe(false);
		expect(getIconData(`${prefix}:invalid`)).toBeUndefined();
		expect(getIcon(`${prefix}:invalid`)).toBeNull();
	});

	it('Invalid icon name', () => {
		const testName = 'storage' + (count++).toString();

		// Empty
		expect(iconExists(testName)).toBe(false);
		expect(getIconData(testName)).toBeUndefined();
		expect(getIcon(testName)).toBeNull();

		// Add and test one icon (icon should not be added)
		expect(
			addIcon(testName, {
				body: '<g />',
			})
		).toBe(false);
		expect(iconExists(testName)).toBe(false);
	});

	it('Invalid icon set', () => {
		// Icon set without prefix (should work only when simple names are allowed, tested later in this file)
		expect(
			addCollection({
				prefix: '',
				icons: {
					foo: {
						body: '<g />',
					},
				},
			})
		).toBe(false);
	});

	it('Simple icon name', () => {
		const testName = 'storage' + (count++).toString();

		// Enable empty storage
		allowSimpleNames(true);

		// Empty
		expect(iconExists(testName)).toBe(false);
		expect(getIcon(testName)).toBeNull();

		// Add and test one icon
		expect(
			addIcon(testName, {
				body: '<g />',
			})
		).toBe(true);
		expect(iconExists(testName)).toBe(true);
	});

	it('Collection with simple icon name', () => {
		const n = count++;
		const n2 = count++;
		let name: string;

		// Enable empty storage
		allowSimpleNames(true);

		// Add icon set
		const name1 = 'test' + n.toString();
		const prefix2 = `prefixed${n}`;
		const name2 = `icon${n2}`;
		const missing = `missing${n}`;
		expect(
			addCollection({
				prefix: '',
				icons: {
					[name1]: {
						body: '<g data-icon="basic-icon" />',
					},
					[`${prefix2}-${name2}`]: {
						body: '<g data-icon="prefixed-icon" />',
					},
				},
				not_found: [missing],
			})
		).toBe(true);

		// Test 'test'
		name = name1;
		expect(iconExists(name)).toBe(true);
		let expected = {
			body: '<g data-icon="basic-icon" />',
		};
		expect(getIconData(name)).toEqual(expected);
		expect(getIcon(name)).toEqual({
			...defaultIconProps,
			...expected,
		});

		// Test prefixed icon, using ':' separator
		name = `${prefix2}:${name2}`;
		expect(listIcons('', prefix2)).toEqual([name]);
		expect(iconExists(name)).toBe(true);
		expected = {
			body: '<g data-icon="prefixed-icon" />',
		};
		expect(getIconData(name)).toEqual(expected);
		expect(getIcon(name)).toEqual({
			...defaultIconProps,
			...expected,
		});

		// Test prefixed icon, using '-' separator
		name = `${prefix2}-${name2}`;
		expect(iconExists(name)).toBe(true);
		expected = {
			body: '<g data-icon="prefixed-icon" />',
		};
		expect(getIconData(name)).toEqual(expected);
		expect(getIcon(name)).toEqual({
			...defaultIconProps,
			...expected,
		});

		// Test missing icon: should not exist because without provider missing icon cannot be added
		expect(iconExists(missing)).toBe(false);
		expect(getIconData(missing)).toBeUndefined();
		expect(getIcon(missing)).toBeNull();
	});
});
