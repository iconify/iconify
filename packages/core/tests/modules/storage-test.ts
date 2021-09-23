import { fullIcon } from '@iconify/utils/lib/icon';
import {
	storageFunctions,
	allowSimpleNames,
} from '../../lib/storage/functions';

describe('Testing IconifyStorageFunctions', () => {
	let count = 0;

	function nextProvider(): string {
		return 'storage-test-' + count++;
	}

	it('Storage functions', () => {
		const provider = nextProvider();
		const testName = `@${provider}:foo:bar`;

		// Empty
		expect(storageFunctions.iconExists(testName)).toBe(false);
		expect(storageFunctions.getIcon(testName)).toBeNull();
		expect(storageFunctions.listIcons(provider)).toEqual([]);

		// Add and test one icon
		expect(
			storageFunctions.addIcon(testName, {
				body: '<g />',
			})
		).toBe(true);
		expect(storageFunctions.iconExists(testName)).toBe(true);
		expect(storageFunctions.listIcons(provider)).toEqual([testName]);
	});

	it('Invalid icon name', () => {
		const testName = 'storage' + count++;

		// Reset module
		allowSimpleNames(false);

		// Empty
		expect(storageFunctions.iconExists(testName)).toBe(false);
		expect(storageFunctions.getIcon(testName)).toBeNull();

		// Add and test one icon (icon should not be added)
		expect(
			storageFunctions.addIcon(testName, {
				body: '<g />',
			})
		).toBe(false);
		expect(storageFunctions.iconExists(testName)).toBe(false);
	});

	it('Invalid icon set', () => {
		// Reset module
		allowSimpleNames(false);

		// Icon set without prefix (should work only when simple names are allowed, tested later in this file)
		expect(
			storageFunctions.addCollection({
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
		const testName = 'storage' + count++;

		// Enable empty storage
		allowSimpleNames(true);

		// Empty
		expect(storageFunctions.iconExists(testName)).toBe(false);
		expect(storageFunctions.getIcon(testName)).toBeNull();

		// Add and test one icon
		expect(
			storageFunctions.addIcon(testName, {
				body: '<g />',
			})
		).toBe(true);
		expect(storageFunctions.iconExists(testName)).toBe(true);

		// Reset config after test
		allowSimpleNames(false);
	});

	it('Collection with simple icon name', () => {
		const n = count++;
		const n2 = count++;
		let name: string;

		// Enable empty storage
		allowSimpleNames(true);

		// Add icon set
		const name1 = 'test' + n;
		const prefix2 = `prefixed${n}`;
		const name2 = `icon${n2}`;
		expect(
			storageFunctions.addCollection({
				prefix: '',
				icons: {
					[name1]: {
						body: '<g data-icon="basic-icon" />',
					},
					[`${prefix2}-${name2}`]: {
						body: '<g data-icon="prefixed-icon" />',
					},
				},
			})
		).toBe(true);

		// Test 'test'
		name = name1;
		expect(storageFunctions.iconExists(name)).toBe(true);
		expect(storageFunctions.getIcon(name)).toEqual(
			fullIcon({
				body: '<g data-icon="basic-icon" />',
			})
		);

		// Test prefixed icon, using ':' separator
		name = `${prefix2}:${name2}`;
		expect(storageFunctions.listIcons('', prefix2)).toEqual([name]);
		expect(storageFunctions.iconExists(name)).toBe(true);
		expect(storageFunctions.getIcon(name)).toEqual(
			fullIcon({
				body: '<g data-icon="prefixed-icon" />',
			})
		);

		// Test prefixed icon, using '-' separator
		name = `${prefix2}-${name2}`;
		expect(storageFunctions.iconExists(name)).toBe(true);
		expect(storageFunctions.getIcon(name)).toEqual(
			fullIcon({
				body: '<g data-icon="prefixed-icon" />',
			})
		);

		// Reset config after test
		allowSimpleNames(false);
	});
});
