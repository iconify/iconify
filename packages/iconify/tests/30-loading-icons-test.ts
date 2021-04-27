import 'mocha';
import { expect } from 'chai';
import Iconify, { IconifyIconName } from '../dist/iconify';
import { mockAPIModule, mockAPIData } from '@iconify/core/lib/api/modules/mock';

// API provider and prefix for test
const provider = 'mock-api';
const prefix = 'prefix';

// Set API module for provider
Iconify.addAPIProvider(provider, {
	resources: ['http://localhost'],
});
Iconify._api.setAPIModule(provider, mockAPIModule);

// Set data
mockAPIData({
	provider,
	prefix,
	response: {
		prefix,
		icons: {
			home: {
				body:
					'<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"/>',
			},
		},
		width: 24,
		height: 24,
	},
});

// Test
describe('Testing loadIcons() with Node.js', () => {
	it('Load icons from API', (done) => {
		const name = 'home';
		const fullName = '@' + provider + ':' + prefix + ':' + name;

		Iconify.loadIcons([fullName], (loaded, missing) => {
			// Check callback data
			expect(missing).to.be.eql([]);
			const icon: IconifyIconName = {
				provider,
				prefix,
				name,
			};
			expect(loaded).to.be.eql([icon]);

			// Check if icon exists
			expect(Iconify.iconExists(fullName)).to.be.equal(true);

			done();
		});
	});
});
