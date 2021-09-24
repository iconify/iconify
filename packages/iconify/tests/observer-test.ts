import Iconify from '../dist/iconify';

describe('Testing Iconify observer functions with Node.js', () => {
	it('Observer functions', () => {
		// All functions should fail, not without throwing exceptions
		expect(Iconify.scan()).toBeUndefined();
		expect(Iconify.pauseObserver()).toBeUndefined();
		expect(Iconify.resumeObserver()).toBeUndefined();

		// Cannot test observe() and stopObserving() because they require DOM node as parameter
	});
});
