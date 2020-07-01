import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';
import { setRoot } from '@iconify/iconify/lib/modules/root';
import {
	initObserver,
	isObserverPaused,
	pauseObserver,
} from '@iconify/iconify/lib/modules/observer';

const expect = chai.expect;

describe('Testing observer creation', () => {
	it('Creating observer and triggering event', (done) => {
		const node = getNode('observer-creation');
		setRoot(node);

		let counter = 0;

		node.innerHTML = '<div></div><ul><li>test</li><li>test2</li></ul>';
		initObserver((root) => {
			expect(root).to.be.equal(node);

			counter++;

			// Should be called only once
			expect(counter).to.be.equal(1);

			expect(isObserverPaused()).to.be.equal(false);

			// Pause observer
			pauseObserver();
			expect(isObserverPaused()).to.be.equal(true);

			done();
		});

		// Add few nodes to trigger observer
		expect(isObserverPaused()).to.be.equal(false);
		node.querySelector('div').innerHTML =
			'<span class="test">Some text</span><i>!</i>';
	});
});
