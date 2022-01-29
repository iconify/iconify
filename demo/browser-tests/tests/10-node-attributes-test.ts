import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';

const expect = chai.expect;

// Dummy svgAttributes variable
const svgAttributes: Record<string, unknown> = {};

/**
 * Copy attributes from placeholder to SVG.
 *
 * This is similar to code used in render.ts
 *
 * @param placeholderElement
 * @param svg
 */
function copyData(placeholderElement, svg) {
	const svgStyle = svg.style;

	// Copy attributes from placeholder
	const placeholderAttributes = placeholderElement.attributes;
	for (let i = 0; i < placeholderAttributes.length; i++) {
		const item = placeholderAttributes.item(i);
		if (item) {
			const name = item.name;
			if (
				name !== 'class' &&
				name !== 'style' &&
				svgAttributes[name] === void 0
			) {
				try {
					svg.setAttribute(name, item.value);
				} catch (err) {}
			}
		}
	}

	// Copy styles from placeholder
	const placeholderStyle = placeholderElement.style;
	for (let i = 0; i < placeholderStyle.length; i++) {
		const attr = placeholderStyle[i];
		const value = placeholderStyle[attr];
		if (value !== '') {
			svgStyle[attr] = value;
		}
	}
}

describe('Testing copying node data', () => {
	it('Inline attributes', () => {
		const node = getNode('node-attributes');
		node.innerHTML = '<p title="Testing" data-foo="bar">Test</p>';

		const source = node.querySelector('p');
		const target = document.createElement('span');
		copyData(source, target);

		// Test title
		expect(source.getAttribute('title')).to.be.equal(
			'Testing',
			'Source title should be set'
		);
		expect(target.getAttribute('title')).to.be.equal(
			'Testing',
			'Target title should be set'
		);

		// Test data-*
		expect(source.getAttribute('data-foo')).to.be.equal(
			'bar',
			'Source data-foo should be set'
		);
		expect(target.getAttribute('data-foo')).to.be.equal(
			'bar',
			'Target data-foo should be set'
		);
	});

	it('Inline style', () => {
		const node = getNode('node-attributes');
		node.innerHTML =
			'<p style="color: red; border: 1px solid green; vertical-align: -.1em">Test</p>';

		const source = node.querySelector('p');
		const target = document.createElement('span');
		copyData(source, target);

		// Test color
		expect(source.style.color).to.be.equal(
			'red',
			'Source color should be red'
		);
		expect(target.style.color).to.be.equal(
			'red',
			'Target color should be red'
		);

		// Test border width
		expect(source.style.borderWidth).to.be.equal(
			'1px',
			'Source border width should be 1px'
		);
		expect(target.style.borderWidth).to.be.equal(
			'1px',
			'Target border width should be 1px'
		);

		// Test background color
		expect(source.style.backgroundColor).to.be.equal(
			'',
			'Source background color should not be set'
		);
		expect(target.style.backgroundColor).to.be.equal(
			'',
			'Target background color should not be set'
		);
	});

	it('DOM style', () => {
		const node = getNode('node-attributes');
		node.innerHTML = '<p>Test</p>';

		const source = node.querySelector('p');
		source.style.color = 'green';
		source.style.border = '2px solid blue';

		const target = document.createElement('span');
		copyData(source, target);

		// Test color
		expect(source.style.color).to.be.equal(
			'green',
			'Source color should be green'
		);
		expect(target.style.color).to.be.equal(
			'green',
			'Target color should be green'
		);

		// Test border width
		expect(source.style.borderWidth).to.be.equal(
			'2px',
			'Source border width should be 2px'
		);
		expect(target.style.borderWidth).to.be.equal(
			'2px',
			'Target border width should be 2px'
		);

		// Test background color
		expect(source.style.backgroundColor).to.be.equal(
			'',
			'Source background color should not be set'
		);
		expect(target.style.backgroundColor).to.be.equal(
			'',
			'Target background color should not be set'
		);
	});

	it('Overwriting source style before copy', () => {
		const node = getNode('node-attributes');
		node.innerHTML = '<p style="color: blue">Test</p>';

		const source = node.querySelector('p');

		// Overwrite inline style
		source.style.color = 'purple';

		const target = document.createElement('span');
		copyData(source, target);

		// Test color
		expect(source.style.color).to.be.equal(
			'purple',
			'Source color should be purple'
		);
		expect(target.style.color).to.be.equal(
			'purple',
			'Target color should be purple'
		);
	});

	it('Overwriting target style during copy', () => {
		const node = getNode('node-attributes');
		node.innerHTML = '<p style="color: blue">Test</p>';

		const source = node.querySelector('p');
		const target = document.createElement('span');

		// Set target style
		target.style.color = 'purple';
		target.style.verticalAlign = '-0.2em';

		copyData(source, target);

		// Test color
		expect(source.style.color).to.be.equal(
			'blue',
			'Source color should be blue'
		);
		expect(target.style.color).to.be.equal(
			'blue',
			'Target color should be blue'
		);

		// Test vertical-align
		expect(source.style.verticalAlign).to.be.equal(
			'',
			'Source vartical-align should not be set'
		);
		expect(target.style.verticalAlign).to.be.equal(
			'-0.2em',
			'Target vertical-align should be set'
		);
	});
});
