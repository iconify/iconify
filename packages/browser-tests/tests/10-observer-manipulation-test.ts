import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';
import { elementFinderProperty } from '@iconify/iconify/lib/element';
import { browserModules } from '@iconify/iconify/lib/modules';
import { observer } from '@iconify/iconify/lib/modules/observer';

const expect = chai.expect;

describe('Testing observer with DOM manipulation', () => {
	it('Series of events', (done) => {
		const node = getNode('observer-manipulation');
		browserModules.root = node;

		let counter = 0;
		let waitingCallback: string | boolean = true;

		node.innerHTML =
			'<div></div><ul><li>test</li><li>test2</li></ul><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg); vertical-align: -0.125em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" data-icon="mdi-home" data-inline="false" class="iconify"><path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"></path></svg>';
		observer.init((root) => {
			expect(root).to.be.equal(node);
			expect(waitingCallback).to.be.equal(true);

			counter++;

			switch (counter) {
				case 1:
					// Added few nodes
					// Remove few nodes. It should not trigger event listener
					waitingCallback = 'removing nodes';
					(() => {
						const item = node.querySelector('ul > li:last-child');
						const parent = item.parentNode;
						parent.removeChild(item);

						// Set timer for next step to make sure callback is not called
						setTimeout(() => {
							// Add node. This should trigger callback
							const newItem = document.createElement('li');
							parent.appendChild(newItem);
							waitingCallback = true;
						}, 50);
					})();
					break;

				case 2:
					// Added one list item
					// Pause observer
					waitingCallback = 'pause test';
					(() => {
						const item = node.querySelector('ul > li:last-child');
						observer.pause();
						item.innerHTML = '<string>Strong</strong> text!';

						// Set timer for next step to make sure callback is not called
						setTimeout(() => {
							// Resume observer and wait a bit. Resuming observer should not trigger update
							waitingCallback = 'resume test';
							observer.resume();

							setTimeout(() => {
								// Change text of item: should remove <strong> and add new text node
								waitingCallback = true;
								item.innerHTML = 'Weak text!';
							}, 50);
						}, 50);
					})();
					break;

				case 3:
					waitingCallback = 'attributes on ul';
					(() => {
						const item = node.querySelector('ul');
						item.setAttribute('data-foo', 'bar');

						// Set timer for next step to make sure callback is not called
						setTimeout(() => {
							waitingCallback = true;
							const item = node.querySelector('svg');
							item[elementFinderProperty] = true; // Add fake finder property to trigger update
							item.setAttribute('data-icon', 'mdi-account');
							item.setAttribute('data-rotate', '2');
						}, 50);
					})();
					break;

				case 4:
					(() => {
						// Test removing attribute from SVG
						const item = node.querySelector('svg');
						item.removeAttribute('data-rotate');
					})();
					break;

				case 5:
					done();
					break;

				default:
					done('Unexpected callback call!');
			}
		});

		// Add few nodes to trigger observer
		expect(observer.isPaused()).to.be.equal(false);
		node.querySelector('div').innerHTML =
			'<span class="test">Some text</span><i>!</i>';
	});
});
