import mocha from 'mocha';
import chai from 'chai';

import { getNode, setRoot } from './node';
import { addFinder } from '@iconify/iconify/lib/modules/finder';
import { finder as iconifyFinder } from '@iconify/iconify/lib/finders/iconify';
import { finder as iconifyIconFinder } from '@iconify/iconify/lib/finders/iconify-icon';
import { getStorage, addIconSet } from '@iconify/core/lib/storage/storage';
import { listRootNodes } from '@iconify/iconify/lib/modules/root';
import { scanDOM } from '@iconify/iconify/lib/modules/scanner';
import {
	initObserver,
	observe,
	stopObserving,
} from '@iconify/iconify/lib/modules/observer';

const expect = chai.expect;

describe('Observe DOM', () => {
	const storage = getStorage('', 'mdi');

	before(() => {
		// Add finders
		addFinder(iconifyFinder);
		addFinder(iconifyIconFinder);

		// Add mentioned icons to storage
		addIconSet(storage, {
			prefix: 'mdi',
			icons: {
				'account-box': {
					body: '<path d="M6 17c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6m9-9a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" fill="currentColor"/>',
				},
				'account-cash': {
					body: '<path d="M11 8c0 2.21-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4m0 6.72V20H0v-2c0-2.21 3.13-4 7-4c1.5 0 2.87.27 4 .72M24 20H13V3h11v17m-8-8.5a2.5 2.5 0 0 1 5 0a2.5 2.5 0 0 1-5 0M22 7a2 2 0 0 1-2-2h-3c0 1.11-.89 2-2 2v9a2 2 0 0 1 2 2h3c0-1.1.9-2 2-2V7z" fill="currentColor"/>',
				},
				'account': {
					body: '<path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" fill="currentColor"/>',
				},
				'home': {
					body: '<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"/>',
				},
			},
			width: 24,
			height: 24,
		});
	});

	it('Basic test', (done) => {
		const node = getNode('observe-dom');
		const ignoredNode = getNode('observe-dom');

		// Set root and init observer
		setRoot(node);
		initObserver(scanDOM);

		// Test listRootNodes
		const nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(node);
		expect(nodes[0].temporary).to.be.equal(false);

		// Set HTML
		node.innerHTML =
			'<p>Testing observing DOM (should render SVG!)</p>' +
			'<span class="iconify" data-icon="mdi:home"></span>';
		ignoredNode.innerHTML =
			'<p>This node should be ignored</p>' +
			'<span class="iconify" data-icon="mdi:home"></span>';

		// Test nodes
		setTimeout(() => {
			// Find elements
			let elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(1);

			elements = ignoredNode.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(
				0,
				'Looks like document.body is observed!'
			);

			// Test for "home" icon contents
			expect(node.innerHTML.indexOf('20v-6h4v6h5v')).to.not.be.equal(-1);

			done();
		}, 100);
	});

	it('Change icon', (done) => {
		const node = getNode('observe-dom');

		// Set root and init observer
		setRoot(node);
		initObserver(scanDOM);

		// Set HTML
		node.innerHTML =
			'<p>Testing observing DOM (should render SVG!)</p>' +
			'<span class="iconify" data-icon="mdi:home"></span>';

		// Test nodes
		setTimeout(() => {
			// Find elements
			const elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(1);

			// Test for "home" icon contents
			expect(node.innerHTML.indexOf('20v-6h4v6h5v')).to.not.be.equal(-1);

			// Change icon
			elements[0].setAttribute('data-icon', 'mdi:account');

			// Test nodes after timer
			setTimeout(() => {
				// Find elements
				const elements = node.querySelectorAll('svg.iconify');
				expect(elements.length).to.be.equal(1);

				// Test for "home" icon contents
				expect(node.innerHTML.indexOf('20v-6h4v6h5v')).to.be.equal(-1);
				expect(node.innerHTML.indexOf('M12 4a4')).to.not.be.equal(-1);

				done();
			}, 100);
		}, 100);
	});

	it('Adding node to observe', (done) => {
		const baseNode = getNode('observe-dom');
		const node = getNode('observe-dom');

		// Set root and init observer
		setRoot(baseNode);
		initObserver(scanDOM);

		// Test listRootNodes
		let nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(baseNode);
		expect(nodes[0].temporary).to.be.equal(false);

		// Observe another node
		observe(node);

		nodes = listRootNodes();
		expect(nodes.length).to.be.equal(2);
		expect(nodes[0].node).to.be.equal(baseNode);
		expect(nodes[0].temporary).to.be.equal(false);
		expect(nodes[1].node).to.be.equal(node);
		expect(nodes[1].temporary).to.be.equal(false);

		// Set HTML
		baseNode.innerHTML =
			'<p>Testing observing 2 nodes (1) (should render SVG!)</p>' +
			'<span class="iconify" data-icon="mdi:home"></span>';
		node.innerHTML =
			'<p>Testing observing 2 nodes (2) (should render SVG!)</p>' +
			'<span class="iconify" data-icon="mdi:home"></span>';

		// Test nodes
		setTimeout(() => {
			// Find elements
			let elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(1);

			elements = baseNode.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(1);

			// Test for "home" icon contents
			expect(node.innerHTML.indexOf('20v-6h4v6h5v')).to.not.be.equal(-1);
			expect(baseNode.innerHTML.indexOf('20v-6h4v6h5v')).to.not.be.equal(
				-1
			);

			done();
		}, 100);
	});

	it('Adding node to observe after setting content', (done) => {
		const baseNode = getNode('observe-dom');
		const node = getNode('observe-dom');

		// Set root and init observer
		setRoot(baseNode);
		initObserver(scanDOM);

		// Test listRootNodes
		let nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(baseNode);
		expect(nodes[0].temporary).to.be.equal(false);

		// Set HTML
		baseNode.innerHTML =
			'<p>Testing observing 2 nodes (1) (should render SVG!)</p>' +
			'<span class="iconify" data-icon="mdi:home"></span>';
		node.innerHTML =
			'<p>Testing observing 2 nodes (2) (should render SVG!)</p>' +
			'<span class="iconify" data-icon="mdi:home"></span>';

		// Observe node: should run scan on next tick
		observe(node);

		// Test nodes
		setTimeout(() => {
			// Find elements
			let elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(1);

			elements = baseNode.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(1);

			// Test for "home" icon contents
			expect(node.innerHTML.indexOf('20v-6h4v6h5v')).to.not.be.equal(-1);
			expect(baseNode.innerHTML.indexOf('20v-6h4v6h5v')).to.not.be.equal(
				-1
			);

			done();
		}, 100);
	});

	it('Stop observing node', (done) => {
		const baseNode = getNode('observe-dom');
		const node = getNode('observe-dom');

		// Set root and init observer
		setRoot(baseNode);
		initObserver(scanDOM);

		// Test listRootNodes
		let nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(baseNode);
		expect(nodes[0].temporary).to.be.equal(false);

		// Observe another node
		observe(node);

		nodes = listRootNodes();
		expect(nodes.length).to.be.equal(2);
		expect(nodes[0].node).to.be.equal(baseNode);
		expect(nodes[0].temporary).to.be.equal(false);
		expect(nodes[1].node).to.be.equal(node);
		expect(nodes[1].temporary).to.be.equal(false);

		// Stop observing baseNode
		stopObserving(baseNode);

		nodes = listRootNodes();
		expect(nodes.length).to.be.equal(1);
		expect(nodes[0].node).to.be.equal(node);
		expect(nodes[0].temporary).to.be.equal(false);

		// Set HTML
		baseNode.innerHTML =
			'<p>Testing observing 2 nodes (1) (should NOT render SVG!)</p>' +
			'<span class="iconify" data-icon="mdi:home"></span>';
		node.innerHTML =
			'<p>Testing observing 2 nodes (2) (should render SVG!)</p>' +
			'<span class="iconify" data-icon="mdi:home"></span>';

		// Test nodes
		setTimeout(() => {
			// Find elements
			let elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(1);

			elements = baseNode.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(0);

			// Test for "home" icon contents
			expect(node.innerHTML.indexOf('20v-6h4v6h5v')).to.not.be.equal(-1);
			expect(baseNode.innerHTML.indexOf('20v-6h4v6h5v')).to.be.equal(-1);

			done();
		}, 100);
	});
});
