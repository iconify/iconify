import 'mocha';
import { expect } from 'chai';
import Iconify from '../dist/iconify';

describe('Testing Iconify observer functions with Node.js', () => {
	it('Observer functions', () => {
		// All functions should fail, not without throwing exceptions
		expect(Iconify.scan()).to.be.equal(void 0);
		expect(Iconify.pauseObserver()).to.be.equal(void 0);
		expect(Iconify.resumeObserver()).to.be.equal(void 0);

		// Cannot test observe() and stopObserving() because they require DOM node as parameter
	});
});
