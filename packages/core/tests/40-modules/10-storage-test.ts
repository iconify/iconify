import 'mocha';
import { expect } from 'chai';
import { storageFunctions } from '../../lib/storage/functions';

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
});
