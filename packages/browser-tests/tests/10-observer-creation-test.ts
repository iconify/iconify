import mocha from 'mocha';
import chai from 'chai';

import { getNode, setRoot } from './node';
import { listRootNodes } from '@iconify/iconify/lib/modules/root';
import {
	initObserver,
	pauseObserver,
} from '@iconify/iconify/lib/modules/observer';

const expect = chai.expect;

describe('Testing observer creation', () => {
	it('Creating observer and triggering event', (done) => {
		const node = getNode('observer-creation');
		setRoot(node);

		// Get node
		const list = listRootNodes();
		expect(list.length).to.be.equal(1);

		const item = list[0];
		expect(item.node).to.be.equal(node);
		expect(item.observer).to.be.equal(void 0);

		// Do test
		let counter = 0;

		node.innerHTML = '<div></div><ul><li>test</li><li>test2</li></ul>';
		initObserver((root) => {
			expect(root.node).to.be.equal(node);

			counter++;

			// Should be called only once
			expect(counter).to.be.equal(1);

			// Check if observer is paused
			expect(item.observer).to.not.be.equal(void 0);
			expect(item.observer.paused).to.be.equal(0);

			// Pause observer
			pauseObserver();
			expect(item.observer.paused).to.be.equal(1);

			done();
		});

		// Add few nodes to trigger observer
		expect(item.observer).to.not.be.equal(void 0);
		expect(item.observer.paused).to.be.equal(0);
		node.querySelector('div').innerHTML =
			'<span class="test">Some text</span><i>!</i>';
	});
});
