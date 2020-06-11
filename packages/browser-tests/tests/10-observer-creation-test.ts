import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';
import { browserModules } from '@iconify/iconify/lib/modules';
import { observer } from '@iconify/iconify/lib/observer/observer';

const expect = chai.expect;

describe('Testing observer creation', () => {
	it('Creating observer and triggering event', (done) => {
		const node = getNode('observer-creation');
		browserModules.root = node;

		let counter = 0;

		node.innerHTML = '<div></div><ul><li>test</li><li>test2</li></ul>';
		observer.init((root) => {
			expect(root).to.be.equal(node);

			counter++;

			// Should be called only once
			expect(counter).to.be.equal(1);

			expect(observer.isPaused()).to.be.equal(false);

			// Pause observer
			observer.pause();
			expect(observer.isPaused()).to.be.equal(true);

			done();
		});

		// Add few nodes to trigger observer
		expect(observer.isPaused()).to.be.equal(false);
		node.querySelector('div').innerHTML =
			'<span class="test">Some text</span><i>!</i>';
	});
});
