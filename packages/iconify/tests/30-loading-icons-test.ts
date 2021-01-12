import 'mocha';
import { expect } from 'chai';
import Iconify, { IconifyIconName } from '../dist/iconify';

describe('Testing loadIcons() with Node.js', () => {
	it('Load icons from API (requires internet access and cross-fetch installed as dependency)', (done) => {
		const prefix = 'mdi';
		const name = 'home';

		Iconify.loadIcons([prefix + ':' + name], (loaded, missing) => {
			// Check callback data
			expect(missing).to.be.eql([]);
			const icon: IconifyIconName = {
				provider: '',
				prefix,
				name,
			};
			expect(loaded).to.be.eql([icon]);

			// Check if icon exists
			expect(Iconify.iconExists(prefix + ':' + name)).to.be.equal(true);

			done();
		});
	});
});
