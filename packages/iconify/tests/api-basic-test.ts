import Iconify from '../';

describe('Testing Iconify API functions with Node.js', () => {
	it('Cache functions', () => {
		// All functions should fail, not without throwing exceptions
		expect(Iconify.disableCache('all')).toBeUndefined();
		expect(Iconify.enableCache('all')).toBeUndefined();
	});

	it('Adding API provider', () => {
		// Add dummy provider. Should not throw exceptions and return true on success
		expect(
			Iconify.addAPIProvider('test', {
				resources: ['http://localhost'],
			})
		).toBe(true);
	});
});
