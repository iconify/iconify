import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';
import { addFinder, findPlaceholders } from '@iconify/iconify/lib/finder';
import { finder as iconifyFinder } from '@iconify/iconify/lib/finders/iconify-v1';
import { finder as iconifyIconFinder } from '@iconify/iconify/lib/finders/iconify-v1-icon';
import { getStorage, addIconSet, getIcon } from '@iconify/core/lib/storage';
import { renderIcon } from '@iconify/iconify/lib/render';
import { stringToIcon } from '@iconify/core/lib/icon/name';
import { IconifyElement } from '@iconify/iconify/lib/element';

const expect = chai.expect;

// Add finders
addFinder(iconifyIconFinder);
addFinder(iconifyFinder);

describe('Testing legacy renderer', () => {
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

	it('Convert placeholders to SVG', () => {
		const node = getNode('renderer');
		node.innerHTML =
			'<div><p>Testing renderer v1</p><ul>' +
			'<li>Inline icons:<br />' +
			'   Red icon with red border: <span class="iconify" data-icon="mdi:home" style="color: red; border: 1px solid red;"></span><br />' +
			'   No vertical-align, green border: <i class="iconify test-icon iconify--mdi-account" data-icon="mdi:account" style="vertical-align: 0;" data-flip="horizontal" aria-hidden="false"></i>' +
			'</li>' +
			'<li>Block icons:' +
			'   <iconify-icon data-icon="mdi-account-cash" title="&lt;Cash&gt;!"></iconify-icon>' +
			'   <span class="iconify-icon" data-icon="mdi:account" data-flip="vertical" data-width="auto"></span>' +
			'</li>' +
			'<li>Changed by attribute:' +
			'   <iconify-icon data-icon="mdi:account-box" data-inline="true" data-rotate="2" data-width="42"></iconify-icon>' +
			'</li>' +
			'<li>Mix of classes:' +
			'   <i class="iconify iconify-icon should-be-block" data-icon="mdi:home"></i>' +
			'</li>' +
			'</ul></div>';

		// Get items
		const items = findPlaceholders(node);
		expect(items.length).to.be.equal(6);

		// Test finders to make sure icons are in correct order
		expect(items[0].finder).to.be.equal(iconifyIconFinder);
		expect(items[1].finder).to.be.equal(iconifyIconFinder);
		expect(items[2].finder).to.be.equal(iconifyIconFinder);
		expect(items[3].finder).to.be.equal(iconifyIconFinder);
		expect(items[4].finder).to.be.equal(iconifyFinder);
		expect(items[5].finder).to.be.equal(iconifyFinder);

		/**
		 * Test third icon (first 2 should be last)
		 */
		let element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'account-cash',
		});
		expect(element.finder).to.be.equal(iconifyIconFinder);

		// Get and test customisations
		let customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: false,
		});

		// Get icon data
		let iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		let svg = renderIcon(
			element,
			customisations,
			iconData
		) as IconifyElement;

		// Test SVG
		expect(svg.tagName.toUpperCase()).to.be.equal('SVG');
		expect(svg.getAttribute('viewBox')).to.be.equal('0 0 24 24');
		expect(svg.getAttribute('height')).to.be.equal('1em');
		expect(svg.getAttribute('data-icon')).to.be.equal('mdi-account-cash'); // name should stay as is
		expect(svg.getAttribute('class')).to.be.equal('iconify iconify--mdi');
		expect(svg.getAttribute('title')).to.be.equal('<Cash>!'); // title, unescaped
		expect(svg.style.verticalAlign).to.be.equal('');

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi-account-cash');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);

		/**
		 * Test fourth item
		 */
		element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'account',
		});
		expect(element.finder).to.be.equal(iconifyIconFinder);

		// Get and test customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: false,
			vFlip: true,
			width: 'auto',
		});

		// Get icon data
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		svg = renderIcon(element, customisations, iconData) as IconifyElement;

		// Test SVG
		expect(svg.tagName.toUpperCase()).to.be.equal('SVG');
		expect(svg.getAttribute('viewBox')).to.be.equal('0 0 24 24');
		expect(svg.getAttribute('height')).to.be.equal('24');
		expect(svg.getAttribute('data-icon')).to.be.equal('mdi:account');
		expect(svg.getAttribute('class')).to.be.equal(
			'iconify iconify--mdi iconify-icon'
		);

		// Block
		expect(svg.style.verticalAlign).to.be.equal('');

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi:account');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);

		/**
		 * Test fifth icon
		 */
		element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'account-box',
		});
		expect(element.finder).to.be.equal(iconifyIconFinder);

		// Get and test customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: true,
			rotate: 2,
			width: '42',
		});

		// Get icon data
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		svg = renderIcon(element, customisations, iconData) as IconifyElement;

		// Test SVG
		expect(svg.tagName.toUpperCase()).to.be.equal('SVG');
		expect(svg.getAttribute('viewBox')).to.be.equal('0 0 24 24');
		expect(svg.getAttribute('height')).to.be.equal('42');
		expect(svg.getAttribute('data-icon')).to.be.equal('mdi:account-box');
		expect(svg.getAttribute('class')).to.be.equal('iconify iconify--mdi');

		// IE rounds value
		let verticalAlign = svg.style.verticalAlign;
		expect(
			verticalAlign === '-0.125em' || verticalAlign === '-0.12em'
		).to.be.equal(true, 'Invalid vertical-align value: ' + verticalAlign);

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi:account-box');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);

		// Save SVG for rotation test below
		const rotationSVG = svg;

		/**
		 * Test sixth icon
		 */
		element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'home',
		});
		expect(element.finder).to.be.equal(iconifyIconFinder);

		// Get and test customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: false,
		});

		// Get icon data
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		svg = renderIcon(element, customisations, iconData) as IconifyElement;

		// Test SVG
		expect(svg.tagName.toUpperCase()).to.be.equal('SVG');
		expect(svg.getAttribute('viewBox')).to.be.equal('0 0 24 24');
		expect(svg.getAttribute('height')).to.be.equal('1em');
		expect(svg.getAttribute('data-icon')).to.be.equal('mdi:home');
		expect(svg.getAttribute('class')).to.be.equal(
			'iconify iconify--mdi iconify-icon should-be-block'
		);

		// Block
		expect(svg.style.verticalAlign).to.be.equal('');

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi:home');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);

		/**
		 * Test first icon
		 */
		element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'home',
		});
		expect(element.finder).to.be.equal(iconifyFinder);

		// Get and test customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: true,
		});

		// Get icon data
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		svg = renderIcon(element, customisations, iconData) as IconifyElement;

		// Test SVG
		expect(svg.tagName.toUpperCase()).to.be.equal('SVG');
		expect(svg.getAttribute('viewBox')).to.be.equal('0 0 24 24');
		expect(svg.getAttribute('width')).to.be.equal('1em');
		expect(svg.getAttribute('data-icon')).to.be.equal('mdi:home');
		expect(svg.getAttribute('class')).to.be.equal('iconify iconify--mdi');
		expect(svg.style.color).to.be.equal('red'); // color from inline style
		expect(svg.style.borderWidth).to.be.equal('1px'); // border from inline style

		// IE rounds value
		verticalAlign = svg.style.verticalAlign;
		expect(
			verticalAlign === '-0.125em' || verticalAlign === '-0.12em'
		).to.be.equal(true, 'Invalid vertical-align value: ' + verticalAlign);

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi:home');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);

		/**
		 * Test second item
		 */
		element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'account',
		});
		expect(element.finder).to.be.equal(iconifyFinder);

		// Get and test customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: true,
			hFlip: true,
		});

		// Set style
		element.element.style.border = '1px solid green';

		// Get icon data
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		svg = renderIcon(element, customisations, iconData) as IconifyElement;

		// Test SVG
		expect(svg.tagName.toUpperCase()).to.be.equal('SVG');
		expect(svg.getAttribute('viewBox')).to.be.equal('0 0 24 24');
		expect(svg.getAttribute('height')).to.be.equal('1em');
		expect(svg.getAttribute('data-icon')).to.be.equal('mdi:account');
		expect(svg.getAttribute('class')).to.be.equal(
			'iconify iconify--mdi test-icon'
		); // add 'test-icon' class, remove 'iconify--mdi-account'
		expect(svg.style.verticalAlign).to.be.equal('0px'); // inline style overrides verticalAlign from data-align attribute
		expect(svg.style.borderWidth).to.be.equal('1px'); // style set via DOM

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi:account');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);

		// All placeholder should have been replaced
		expect(items).to.be.eql([]);
		expect(findPlaceholders(node)).to.be.eql([]);

		/**
		 * Test finding modified SVG
		 */
		// Remove rotation
		rotationSVG.removeAttribute('data-rotate');
		const items2 = findPlaceholders(node);
		expect(items2.length).to.be.equal(1);

		element = items2.shift();
		expect(element.element).to.be.equal(rotationSVG);
		expect(element.customisations).to.be.eql({
			inline: true,
			width: '42',
		});
	});

	it('Change attributes', () => {
		const node = getNode('renderer');
		node.innerHTML =
			'<div>Testing attributes v1: <span class="iconify" data-icon="mdi:home" data-flip="horizontal" style="color: red; box-shadow: 0 0 2px black;"></span></div>';

		// Get items
		const items = findPlaceholders(node);
		expect(items.length).to.be.equal(1);

		/**
		 * Test icon
		 */
		let element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'home',
		});
		expect(element.finder).to.be.equal(iconifyFinder);

		// Get and test customisations
		let customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: true,
			hFlip: true,
		});

		// Get icon data
		let iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		let svg = renderIcon(
			element,
			customisations,
			iconData
		) as IconifyElement;

		// Test SVG
		expect(svg.tagName.toUpperCase()).to.be.equal('SVG');
		expect(svg.getAttribute('viewBox')).to.be.equal('0 0 24 24');
		expect(svg.getAttribute('width')).to.be.equal('1em');
		expect(svg.getAttribute('data-icon')).to.be.equal('mdi:home');
		expect(svg.getAttribute('class')).to.be.equal('iconify iconify--mdi');
		expect(svg.style.color).to.be.equal('red'); // color from inline style

		// IE rounds value
		let verticalAlign = svg.style.verticalAlign;
		expect(
			verticalAlign === '-0.125em' || verticalAlign === '-0.12em'
		).to.be.equal(true, 'Invalid vertical-align value: ' + verticalAlign);

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi:home');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);

		// Copy variables for next test
		let lastElement = element;
		let lastCustomisations = customisations;
		let lastSVG = svg;

		/**
		 * Render SVG without changes
		 */
		// Create new element
		element = {
			element: svg,
			finder: element.finder,
			name: stringToIcon(element.finder.name(svg) as string),
		};
		expect(element).to.not.be.eql(lastElement); // different 'element' property
		expect(element.name).to.be.eql(lastElement.name);

		// Get customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql(lastCustomisations); // customisations were not changed
		expect(customisations).to.be.eql({
			inline: true,
			hFlip: true,
		});

		// Get icon data and render SVG
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		svg = renderIcon(element, customisations, iconData) as IconifyElement;
		expect(svg).to.not.be.eql(lastSVG);

		// Test attributes, compare them with last SVG
		expect(svg.tagName.toUpperCase()).to.be.equal('SVG');
		[
			'aria-hidden',
			'focusable',
			'role',
			'width',
			'height',
			'viewBox',
			'preserveAspectRatio',
			'data-icon',
			'class',
		].forEach((attr) => {
			expect(svg.getAttribute(attr)).to.be.equal(
				lastSVG.getAttribute(attr),
				'Different values for attribute ' + attr
			);
		});

		['vertical-align', 'color'].forEach((attr) => {
			expect(svg.style[attr]).to.be.equal(
				lastSVG.style[attr],
				'Different values for style ' + attr
			);
		});

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi:home');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);

		// Copy variables for next test
		lastElement = element;
		lastCustomisations = customisations;
		lastSVG = svg;

		/**
		 * Rotate icon
		 */
		lastSVG.setAttribute('data-rotate', '1');

		// Create new element
		element = {
			element: svg,
			finder: element.finder,
			name: stringToIcon(element.finder.name(svg) as string),
		};
		expect(element).to.not.be.eql(lastElement); // different 'element' property
		expect(element.name).to.be.eql(lastElement.name);

		// Get customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.not.be.eql(lastCustomisations); // customisations were changed
		expect(customisations).to.be.eql({
			inline: true,
			rotate: 1,
			hFlip: true,
		});

		// Get icon data and render SVG
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		svg = renderIcon(element, customisations, iconData) as IconifyElement;
		expect(svg).to.not.be.eql(lastSVG);

		// Test changed attributes
		expect(svg.getAttribute('data-rotate')).to.be.equal('1');

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi:home');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);

		// Copy variables for next test
		lastElement = element;
		lastCustomisations = customisations;
		lastSVG = svg;

		/**
		 * Change icon name and reset flip
		 */
		lastSVG.setAttribute('data-icon', 'mdi-account');
		lastSVG.removeAttribute('data-flip');

		// Create new element
		element = {
			element: svg,
			finder: element.finder,
			name: stringToIcon(element.finder.name(svg) as string),
		};
		expect(element).to.not.be.eql(lastElement); // different 'element' and 'name' properties
		expect(element.name).to.not.be.eql(lastElement.name);
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'account',
		});

		// Get customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.not.be.eql(lastCustomisations); // customisations were changed
		expect(customisations).to.be.eql({
			inline: true,
			rotate: 1,
		});

		// Get icon data and render SVG
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		svg = renderIcon(element, customisations, iconData) as IconifyElement;
		expect(svg).to.not.be.eql(lastSVG);

		// Test changed attributes
		expect(svg.getAttribute('data-rotate')).to.be.equal('1');
		expect(svg.getAttribute('data-icon')).to.be.equal('mdi-account');
		expect(svg.getAttribute('data-flip')).to.be.equal(null);

		// Test finder on SVG
		expect(element.finder.name(svg)).to.be.equal('mdi-account');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);
	});

	it('Invalid icon name', () => {
		const node = getNode('renderer');
		node.innerHTML =
			'<div>Testing invalid icon name v1: <span class="iconify" data-icon="mdi:home" data-flip="horizontal" style="color: red; box-shadow: 0 0 2px black;"></span></div>';

		// Get items
		const items = findPlaceholders(node);
		expect(items.length).to.be.equal(1);

		/**
		 * Test icon
		 */
		let element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'home',
		});
		expect(element.finder).to.be.equal(iconifyFinder);

		// Get and test customisations
		let customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: true,
			hFlip: true,
		});

		// Get icon data
		let iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		let svg = renderIcon(
			element,
			customisations,
			iconData
		) as IconifyElement;

		/**
		 * Change icon name to invalid
		 */
		svg.setAttribute('data-icon', 'mdi');
		const name = element.finder.name(svg);
		expect(name).to.be.equal('mdi');
		expect(stringToIcon(name as string)).to.be.equal(null);
	});

	it('Empty icon name', () => {
		const node = getNode('renderer');
		node.innerHTML =
			'<div>Testing empty icon name v1: <span class="iconify" data-icon="mdi:home" data-flip="horizontal" style="color: red; box-shadow: 0 0 2px black;"></span></div>';

		// Get items
		const items = findPlaceholders(node);
		expect(items.length).to.be.equal(1);

		/**
		 * Test icon
		 */
		let element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'home',
		});
		expect(element.finder).to.be.equal(iconifyFinder);

		// Get and test customisations
		let customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: true,
			hFlip: true,
		});

		// Get icon data
		let iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		let svg = renderIcon(
			element,
			customisations,
			iconData
		) as IconifyElement;

		/**
		 * Change icon name to invalid
		 */
		svg.removeAttribute('data-icon');
		expect(element.finder.name(svg)).to.be.equal(null);
	});

	it('Change icon name', () => {
		const node = getNode('renderer');
		node.innerHTML =
			'<div>Testing icon name v1: <span class="iconify" data-icon="mdi:home" data-flip="horizontal" style="color: red; box-shadow: 0 0 2px black;"></span></div>';

		// Get items
		const items = findPlaceholders(node);
		expect(items.length).to.be.equal(1);

		/**
		 * Test icon
		 */
		let element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'home',
		});
		expect(element.finder).to.be.equal(iconifyFinder);

		// Get and test customisations
		let customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: true,
			hFlip: true,
		});

		// Get icon data
		let iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);
		expect(iconData.body.indexOf('M6 17c0-2')).to.be.equal(
			-1,
			'Wrong icon body: ' + iconData.body
		);

		// Render icon
		let svg = renderIcon(
			element,
			customisations,
			iconData
		) as IconifyElement;

		// Copy variables for next test
		let lastElement = element;
		let lastCustomisations = customisations;
		let lastSVG = svg;

		/**
		 * Change name
		 */
		svg.setAttribute('data-icon', 'mdi:account-box');

		// Create new element
		element = {
			element: svg,
			finder: element.finder,
			name: stringToIcon(element.finder.name(svg) as string),
		};
		expect(element).to.not.be.eql(lastElement); // different 'element' and 'name' properties
		expect(element.name).to.not.be.eql(lastElement.name); // different 'name' property

		// Get customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql(lastCustomisations); // customisations were not changed
		expect(customisations).to.be.eql({
			inline: true,
			hFlip: true,
		});

		// Get icon data and render SVG
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Test icon body to make sure icon was changed
		expect(iconData.body.indexOf('M6 17c0-2')).to.not.be.equal(
			-1,
			'Wrong icon body: ' + iconData.body
		);

		svg = renderIcon(element, customisations, iconData) as IconifyElement;
		expect(svg).to.not.be.eql(lastSVG);

		// Test finder
		expect(element.finder.name(svg)).to.be.equal('mdi:account-box');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);
	});

	it('Rotating icon', () => {
		const node = getNode('renderer');
		node.innerHTML =
			'<div>Testing rotation v1: <span class="iconify-icon" data-icon="mdi:home"></span></div>';

		// Get items
		const items = findPlaceholders(node);
		expect(items.length).to.be.equal(1);

		/**
		 * Test icon
		 */
		let element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'home',
		});
		expect(element.finder).to.be.equal(iconifyIconFinder);

		// Get and test customisations
		let customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: false,
		});

		// Get icon data
		let iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		let svg = renderIcon(
			element,
			customisations,
			iconData
		) as IconifyElement;
		let html = renderIcon(
			element,
			customisations,
			iconData,
			true
		) as string;

		// Test icon body to make sure icon has no transformation
		expect(html.indexOf('transform="')).to.be.equal(
			-1,
			'Found transform in icon: ' + html
		);

		// Copy variables for next test
		let lastElement = element;
		let lastCustomisations = customisations;
		let lastSVG = svg;

		/**
		 * Rotate
		 */
		svg.setAttribute('data-rotate', '2');

		// Create new element
		element = {
			element: svg,
			finder: element.finder,
			name: stringToIcon(element.finder.name(svg) as string),
		};
		expect(element).to.not.be.eql(lastElement); // different 'element' property
		expect(element.name).to.be.eql(lastElement.name);

		// Get customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.not.be.eql(lastCustomisations); // customisations were changed
		expect(customisations).to.be.eql({
			inline: false,
			rotate: 2,
		});

		// Get icon data and render SVG
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		svg = renderIcon(element, customisations, iconData) as IconifyElement;
		expect(svg).to.not.be.eql(lastSVG);

		html = renderIcon(element, customisations, iconData, true) as string;

		// Test icon body to make sure icon was changed
		expect(html.indexOf('transform="')).to.not.be.equal(
			-1,
			'Missing transform in icon: ' + html
		);

		// Test finder
		expect(element.finder.name(svg)).to.be.equal('mdi:home');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);
	});

	it('Changing size', () => {
		const node = getNode('renderer');
		node.innerHTML =
			'<div>Testing size v1: <span class="iconify" data-icon="mdi:home" style="box-shadow: 0 0 2px black;"></span></div>';

		// Get items
		const items = findPlaceholders(node);
		expect(items.length).to.be.equal(1);

		/**
		 * Test icon
		 */
		let element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'home',
		});
		expect(element.finder).to.be.equal(iconifyFinder);

		// Get and test customisations
		let customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: true,
		});

		// Get icon data
		let iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		let svg = renderIcon(
			element,
			customisations,
			iconData
		) as IconifyElement;

		// Check dimensions
		expect(svg.getAttribute('width')).to.be.equal('1em');
		expect(svg.getAttribute('height')).to.be.equal('1em');

		// Copy variables for next test
		let lastElement = element;
		let lastCustomisations = customisations;
		let lastSVG = svg;

		/**
		 * Set height
		 */
		svg.setAttribute('data-height', '24');

		// Create new element
		element = {
			element: svg,
			finder: element.finder,
			name: stringToIcon(element.finder.name(svg) as string),
		};
		expect(element).to.not.be.eql(lastElement); // different 'element' property
		expect(element.name).to.be.eql(lastElement.name);

		// Get customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.not.be.eql(lastCustomisations); // customisations were changed
		expect(customisations).to.be.eql({
			inline: true,
			height: '24',
		});

		// Get icon data and render SVG
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		svg = renderIcon(element, customisations, iconData) as IconifyElement;
		expect(svg).to.not.be.eql(lastSVG);

		// Check dimensions
		expect(svg.getAttribute('width')).to.be.equal('24');
		expect(svg.getAttribute('height')).to.be.equal('24');

		// Test finder
		expect(element.finder.name(svg)).to.be.equal('mdi:home');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);
	});

	it('Changing alignment', () => {
		const node = getNode('renderer');
		node.innerHTML =
			'<div>Testing alignment v1: <span class="iconify" data-icon="mdi:home" data-width="48" data-height="24" style="box-shadow: 0 0 2px black;"></span></div>';

		// Get items
		const items = findPlaceholders(node);
		expect(items.length).to.be.equal(1);

		/**
		 * Test icon
		 */
		let element = items.shift();

		// Test element
		expect(element.name).to.be.eql({
			provider: '',
			prefix: 'mdi',
			name: 'home',
		});
		expect(element.finder).to.be.equal(iconifyFinder);

		// Get and test customisations
		let customisations = element.finder.customisations(element.element);
		expect(customisations).to.be.eql({
			inline: true,
			width: '48',
			height: '24',
		});

		// Get icon data
		let iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		// Render icon
		let svg = renderIcon(
			element,
			customisations,
			iconData
		) as IconifyElement;

		// Check dimensions and alignment
		expect(svg.getAttribute('width')).to.be.equal('48');
		expect(svg.getAttribute('height')).to.be.equal('24');
		expect(svg.getAttribute('preserveAspectRatio')).to.be.equal(
			'xMidYMid meet'
		);

		// Copy variables for next test
		let lastElement = element;
		let lastCustomisations = customisations;
		let lastSVG = svg;

		/**
		 * Set alignment
		 */
		svg.setAttribute('data-align', 'left, bottom');

		// Create new element
		element = {
			element: svg,
			finder: element.finder,
			name: stringToIcon(element.finder.name(svg) as string),
		};
		expect(element).to.not.be.eql(lastElement); // different 'element' property
		expect(element.name).to.be.eql(lastElement.name);

		// Get customisations
		customisations = element.finder.customisations(element.element);
		expect(customisations).to.not.be.eql(lastCustomisations); // customisations were changed
		expect(customisations).to.be.eql({
			inline: true,
			width: '48',
			height: '24',
			hAlign: 'left',
			vAlign: 'bottom',
		});

		// Get icon data and render SVG
		iconData = getIcon(storage, element.name.name);
		expect(iconData).to.not.be.equal(null);

		svg = renderIcon(element, customisations, iconData) as IconifyElement;
		expect(svg).to.not.be.eql(lastSVG);

		// Check dimensions and alignment
		expect(svg.getAttribute('width')).to.be.equal('48');
		expect(svg.getAttribute('height')).to.be.equal('24');
		expect(svg.getAttribute('preserveAspectRatio')).to.be.equal(
			'xMinYMax meet'
		);

		// Test finder
		expect(element.finder.name(svg)).to.be.equal('mdi:home');
		expect(element.finder.customisations(svg)).to.be.eql(customisations);
	});
});
