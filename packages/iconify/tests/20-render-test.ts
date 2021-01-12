import 'mocha';
import { expect } from 'chai';
import Iconify, { IconifyIconBuildResult } from '../dist/iconify';

describe('Testing Iconify render functions with Node.js', () => {
	const prefix = 'node-test-render';
	const name = prefix + ':icon';

	it('Render functions', () => {
		// Add icon
		expect(
			Iconify.addIcon(name, {
				body: '<g />',
				width: 24,
				height: 24,
			})
		).to.be.equal(true);

		// renderIcon() should work
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '1em',
				height: '1em',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 24 24',
			},
			body: '<g />',
		};
		expect(Iconify.renderIcon(name, {})).to.be.eql(expected);

		// renderHTML() and renderSVG() should fail because document.createElement does not exist
		expect(Iconify.renderHTML(name, {})).to.be.equal('');
		expect(Iconify.renderSVG(name, {})).to.be.eql(null);
	});
});
