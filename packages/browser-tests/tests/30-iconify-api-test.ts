import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';
import Iconify from '@iconify/iconify/lib/iconify';

const expect = chai.expect;

const selector =
	'span.iconify, i.iconify, span.iconify-inline, i.iconify-inline';

// Do not observe document.body!
Iconify.stopObserving(document.body);

// Create node to observe
const observedNode = getNode('iconify-api');
const ignoredNode = getNode('iconify-api');

Iconify.observe(observedNode);

observedNode.innerHTML =
	'<div><p>Testing Iconify with API</p><ul>' +
	'<li>Inline icons:' +
	'   <span class="iconify-inline" data-icon="mdi:home" style="color: red; box-shadow: 0 0 2px black;"></span>' +
	'   <i class="iconify iconify-inline test-icon iconify--mdi-account" data-icon="mdi:account" style="vertical-align: 0;" data-flip="horizontal" aria-hidden="false"></i>' +
	'</li>' +
	'<li>Block icons:' +
	'   <i class="iconify" data-icon="mdi:account-cash" title="&lt;Cash&gt;!"></i>' +
	'   <span class="iconify" data-icon="mdi:account-box" data-inline="true" data-rotate="2" data-width="42"></span>' +
	'</li>' +
	'</ul></div>';

ignoredNode.innerHTML =
	'<div>This node should not have icons! <span class="iconify-inline" data-icon="mdi:home" style="color: red; box-shadow: 0 0 2px black;"></span>';

describe('Testing Iconify object with API', () => {
	it('Rendering icons with API', () => {
		// Icons should have been replaced by now
		let list = observedNode.querySelectorAll(selector);
		expect(list.length).to.be.equal(0);

		list = observedNode.querySelectorAll('svg.iconify');
		expect(list.length).to.be.equal(4);

		// Icons in ignored node should not have been replaced
		list = ignoredNode.querySelectorAll(selector);
		expect(list.length).to.be.equal(1);

		list = ignoredNode.querySelectorAll('svg.iconify');
		expect(list.length).to.be.equal(0);
	});
});
