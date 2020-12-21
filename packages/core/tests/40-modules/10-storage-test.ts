import 'mocha';
import { expect } from 'chai';
import { getIconName, storageFunctions } from '../../lib/storage/functions';
import { IconifyIconName } from '../../lib/icon/name';

describe('Testing IconifyStorageFunctions', () => {
	let count = 0;

	function nextProvider(): string {
		return 'storage-test-' + count++;
	}

	it('Getting icon name', () => {
		let expected: IconifyIconName;

		expected = {
			provider: '',
			prefix: 'mdi',
			name: 'home',
		};
		expect(getIconName('mdi:home')).to.be.eql(expected);

		expected = {
			provider: 'local-test',
			prefix: 'mdi',
			name: 'home',
		};
		expect(getIconName('@local-test:mdi:home')).to.be.eql(expected);

		expect(getIconName('test')).to.be.equal(null);
	});

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
});
