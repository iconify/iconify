import 'mocha';
import { expect } from 'chai';
import Iconify from '../dist/iconify';

describe('Testing Iconify API functions with Node.js', () => {
	it('Cache functions', () => {
		// All functions should fail, not without throwing exceptions
		expect(Iconify.disableCache('all')).to.be.equal(void 0);
		expect(Iconify.enableCache('all')).to.be.equal(void 0);
	});

	it('Adding API provider', () => {
		// Add dummy provider. Should not throw exceptions and return true on success
		expect(
			Iconify.addAPIProvider('test', {
				resources: ['http://localhost'],
			})
		).to.be.equal(true);
	});
});
