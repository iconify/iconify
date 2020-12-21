import mocha from 'mocha';
import chai from 'chai';

import { getNode, setRoot } from './node';
import { addFinder } from '@iconify/iconify/lib/modules/finder';
import { finder as iconifyFinder } from '@iconify/iconify/lib/finders/iconify';
import { finder as iconifyIconFinder } from '@iconify/iconify/lib/finders/iconify-icon';
import { getStorage, addIconSet } from '@iconify/core/lib/storage/storage';
import { listRootNodes } from '@iconify/iconify/lib/modules/root';
import { scanDOM, scanElement } from '@iconify/iconify/lib/modules/scanner';
import { removeObservedNode } from '@iconify/iconify/lib/modules/observer';

const expect = chai.expect;

// Add finders
addFinder(iconifyFinder);
addFinder(iconifyIconFinder);

describe('Scanning DOM', () => {
	// Add mentioned icons to storage
	const storage = getStorage('', 'mdi');
	addIconSet(storage, {
		prefix: 'mdi',
		icons: {
			'account-box': {
				body:
					'<path d="M6 17c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6m9-9a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" fill="currentColor"/>',
			},
			'account-cash': {
				body:
					'<path d="M11 8c0 2.21-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4m0 6.72V20H0v-2c0-2.21 3.13-4 7-4c1.5 0 2.87.27 4 .72M24 20H13V3h11v17m-8-8.5a2.5 2.5 0 0 1 5 0a2.5 2.5 0 0 1-5 0M22 7a2 2 0 0 1-2-2h-3c0 1.11-.89 2-2 2v9a2 2 0 0 1 2 2h3c0-1.1.9-2 2-2V7z" fill="currentColor"/>',
			},
			'account': {
				body:
					'<path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" fill="currentColor"/>',
			},
			'home': {
				body:
					'<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"/>',
			},
		},
		width: 24,
		height: 24,
	});

	// Sanity check before running tests
	expect(listRootNodes()).to.be.eql([]);

	it('Scan DOM with preloaded icons', () => {
		const node = getNode('scan-dom');
		setRoot(node);

		node.innerHTML =
			'<div><p>Testing scanning DOM (should render SVG!)</p><ul>' +
			'<li>Valid icons:' +
			'   <span class="iconify" data-icon="mdi:home" style="color: red; box-shadow: 0 0 2px black;"></span>' +
			'   <i class="iconify test-icon iconify--mdi-account" data-icon="mdi:account" style="vertical-align: 0;" data-flip="horizontal" aria-hidden="false"></i>' +
			'</li>' +
			'<li>Block icon:' +
			'   <iconify-icon data-icon="mdi-account-cash" title="&lt;Cash&gt;!"></iconify-icon>' +
			'   <iconify-icon data-icon="mdi:account-box" data-inline="true" data-rotate="2" data-width="42"></iconify-icon>' +
			'</li>' +
			'</ul></div>';

		// Scan node
		scanDOM();

		// Find elements
		const elements = node.querySelectorAll('svg.iconify');
		expect(elements.length).to.be.equal(4);

		// Check root nodes list
		const nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(node);
	});

	it('Scan DOM with unattached root', () => {
		const fakeNode = getNode('scan-dom');
		setRoot(fakeNode);

		const node = document.createElement('div');

		node.innerHTML = '<span class="iconify" data-icon="mdi:home"></span>';

		// Check root nodes list
		let nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(fakeNode);

		// Scan node
		scanElement(node);

		// Find elements
		const elements = node.querySelectorAll('svg.iconify');
		expect(elements.length).to.be.equal(1);

		// Make sure tempoary node was not added as root
		nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(fakeNode);
	});

	it('Scan DOM with icon as root', () => {
		const fakeNode = getNode('scan-dom');
		setRoot(fakeNode);

		const node = document.createElement('span');
		node.setAttribute('data-icon', 'mdi:home');

		// Check root nodes list
		let nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(fakeNode);

		// Scan node
		scanElement(node);

		// Check node
		expect(node.tagName).to.be.equal('SPAN');
		expect(node.innerHTML).to.be.equal('');

		// Make sure tempoary node was not added as root
		nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(fakeNode);
	});
});
