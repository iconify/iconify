import 'mocha';
import { expect } from 'chai';
import {
	storageFunctions,
	allowSimpleNames,
} from '../../lib/storage/functions';
import { fullIcon } from '../../lib/icon';

describe('Testing IconifyStorageFunctions', () => {
	let count = 0;

	function nextProvider(): string {
		return 'storage-test-' + count++;
	}

	it('Storage functions', () => {
		const provider = nextProvider();
		const testName = `@${provider}:foo:bar`;

		// Empty
		expect(storageFunctions.iconExists(testName)).to.be.equal(false);
		expect(storageFunctions.getIcon(testName)).to.be.equal(null);
		expect(storageFunctions.listIcons(provider)).to.be.eql([]);

		// Add and test one icon
		expect(
			storageFunctions.addIcon(testName, {
				body: '<g />',
			})
		).to.be.equal(true);
		expect(storageFunctions.iconExists(testName)).to.be.equal(true);
		expect(storageFunctions.listIcons(provider)).to.be.eql([testName]);
	});

	it('Invalid icon name', () => {
		const testName = 'storage' + count++;

		// Reset module
		allowSimpleNames(false);

		// Empty
		expect(storageFunctions.iconExists(testName)).to.be.equal(false);
		expect(storageFunctions.getIcon(testName)).to.be.equal(null);

		// Add and test one icon (icon should not be added)
		expect(
			storageFunctions.addIcon(testName, {
				body: '<g />',
			})
		).to.be.equal(false);
		expect(storageFunctions.iconExists(testName)).to.be.equal(false);
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
		).to.be.equal(false);
	});

	it('Simple icon name', () => {
		const testName = 'storage' + count++;

		// Enable empty storage
		allowSimpleNames(true);

		// Empty
		expect(storageFunctions.iconExists(testName)).to.be.equal(false);
		expect(storageFunctions.getIcon(testName)).to.be.equal(null);

		// Add and test one icon
		expect(
			storageFunctions.addIcon(testName, {
				body: '<g />',
			})
		).to.be.equal(true);
		expect(storageFunctions.iconExists(testName)).to.be.equal(true);

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
		).to.be.equal(true);

		// Test 'test'
		name = name1;
		expect(storageFunctions.iconExists(name)).to.be.equal(true);
		expect(storageFunctions.getIcon(name)).to.be.eql(
			fullIcon({
				body: '<g data-icon="basic-icon" />',
			})
		);

		// Test prefixed icon, using ':' separator
		name = `${prefix2}:${name2}`;
		expect(storageFunctions.listIcons('', prefix2)).to.be.eql([name]);
		expect(storageFunctions.iconExists(name)).to.be.equal(true);
		expect(storageFunctions.getIcon(name)).to.be.eql(
			fullIcon({
				body: '<g data-icon="prefixed-icon" />',
			})
		);

		// Test prefixed icon, using '-' separator
		name = `${prefix2}-${name2}`;
		expect(storageFunctions.iconExists(name)).to.be.equal(true);
		expect(storageFunctions.getIcon(name)).to.be.eql(
			fullIcon({
				body: '<g data-icon="prefixed-icon" />',
			})
		);

		// Reset config after test
		allowSimpleNames(false);
	});
});
