import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';
import { finder } from '@iconify/iconify/lib/finders/iconify';
import { IconifyElement } from '@iconify/iconify/lib/modules/element';
import { IconifyIconCustomisations } from '@iconify/utils/lib/customisations';

const expect = chai.expect;

describe('Testing Iconify finder', () => {
	it('Finding nodes and getting node name', () => {
		const node = getNode('iconify-finder');
		node.innerHTML =
			'<div><p>Testing <span>icons</span> placeholders (not replaced with SVG)</p><ul>' +
			'<li>Valid icons: <span class="iconify" data-icon="mdi:home"></span><i class="iconify-inline" data-icon="mdi:account"></i></li>' +
			'<li>Icon without name: <span class="iconify"></span></li>' +
			'<li>Icon with extra classes: <i class="iconify iconify--mdi" data-icon="mdi:home"></i></li>' +
			'<li>Icon within icon: <span class="iconify" data-icon="mdi:alert:invalid"><i class="iconify" data-icon="mdi:question">text</i></span></li>' +
			'<li>Icon with wrong tag: <p class="iconify" data-icon="mdi:alert"></p></li>' +
			'</ul></div>';

		// Get icons, convert to array
		const results = finder.find(node);
		const list: Element[] = Array.prototype.slice.call(results, 0);

		// Test valid icons
		let element = list.shift();
		expect(element).to.not.be.equal(void 0);
		expect(element.tagName).to.be.equal('SPAN');
		expect(element.getAttribute('data-icon')).to.be.equal('mdi:home');
		expect(finder.name(element as IconifyElement)).to.be.equal('mdi:home');

		element = list.shift();
		expect(element).to.not.be.equal(void 0);
		expect(element.tagName).to.be.equal('I');
		expect(element.getAttribute('data-icon')).to.be.equal('mdi:account');
		expect(finder.name(element as IconifyElement)).to.be.equal(
			'mdi:account'
		);

		// Icon without name
		element = list.shift();
		expect(element).to.not.be.equal(void 0);
		expect(element.tagName).to.be.equal('SPAN');
		expect(element.getAttribute('data-icon')).to.be.equal(null);
		expect(finder.name(element as IconifyElement)).to.be.equal(null);

		// Icon with extra classes
		element = list.shift();
		expect(element).to.not.be.equal(void 0);
		expect(element.tagName).to.be.equal('I');
		expect(element.getAttribute('data-icon')).to.be.equal('mdi:home');
		expect(finder.name(element as IconifyElement)).to.be.equal('mdi:home');

		// Icon within icon
		element = list.shift();
		expect(element).to.not.be.equal(void 0);
		expect(element.tagName).to.be.equal('SPAN');
		expect(element.getAttribute('data-icon')).to.be.equal(
			'mdi:alert:invalid'
		);
		expect(finder.name(element as IconifyElement)).to.be.equal(
			'mdi:alert:invalid' // Validation is done in finder.ts, not in finder instance
		);

		element = list.shift();
		expect(element).to.not.be.equal(void 0);
		expect(element.tagName).to.be.equal('I');
		expect(element.getAttribute('data-icon')).to.be.equal('mdi:question');
		expect(finder.name(element as IconifyElement)).to.be.equal(
			'mdi:question'
		);

		// No more icons
		element = list.shift();
		expect(element).to.be.equal(void 0);
	});

	it('Transformations and inline/block', () => {
		const node = getNode('iconify-finder');
		node.innerHTML =
			'This test does not render SVG!<br />' +
			'Block icons:' +
			'    <span class="iconify-inline" data-icon="mdi:home" data-inline="false"></span>' +
			'Inline rotated icons:' +
			'    <span class="iconify-inline" data-icon="mdi:account" data-rotate="90deg"></span>' +
			'    <span class="iconify iconify-inline" data-icon="mdi:account-circle" data-rotate="2"></span>' +
			'Block rotated icons:' +
			'    <span class="iconify" data-icon="mdi:account-box" data-rotate="175%"></span>' +
			// Invalid rotation
			'    <span class="iconify" data-icon="mdi:user" data-rotate="30%"></span>' +
			'Flip:' +
			'    <span class="iconify" data-icon="ic:baseline-account" data-flip="horizontal,vertical"></span>' +
			// Double 'horizontal' flip: second entry should not change anything
			'    <span class="iconify" data-icon="ic:twotone-account" data-flip="horizontal,vertical,horizontal"></span>' +
			'    <span class="iconify" data-icon="ic:round-account" data-hFlip="true"></span>' +
			'    <span class="iconify" data-icon="ic:sharp-account" data-vFlip="true"></span>' +
			'    <span class="iconify" data-icon="ic:box-account" data-vFlip="false"></span>' +
			// Invalid value
			'    <span class="iconify" data-icon="ic:outline-account" data-hFlip="invalid"></span>' +
			'';

		// Get icons, convert to array
		const results = finder.find(node);
		const list: Element[] = Array.prototype.slice.call(results, 0);

		function testElement(
			name: string,
			expected: IconifyIconCustomisations
		): void {
			let element = list.shift();
			expect(element).to.not.be.equal(void 0);
			expect(element.getAttribute('data-icon')).to.be.equal(name);
			expect(finder.customisations(element as IconifyElement)).to.be.eql(
				expected
			);
		}

		// Block icon
		let element = list.shift();
		expect(element).to.not.be.equal(void 0);
		expect(element.tagName).to.be.equal('SPAN');
		expect(element.getAttribute('data-icon')).to.be.equal('mdi:home');
		const expected: IconifyIconCustomisations = {
			inline: false,
		};
		expect(finder.customisations(element as IconifyElement)).to.be.eql(
			expected
		);

		// Rotated icons
		testElement('mdi:account', {
			inline: true,
			rotate: 1,
		});

		testElement('mdi:account-circle', {
			inline: true,
			rotate: 2,
		});

		testElement('mdi:account-box', {
			inline: false,
			rotate: 3,
		});

		testElement('mdi:user', {
			inline: false,
			// No rotation because 30% is not a valid value
		});

		// Flip
		testElement('ic:baseline-account', {
			inline: false,
			hFlip: true,
			vFlip: true,
		});

		testElement('ic:twotone-account', {
			inline: false,
			hFlip: true,
			vFlip: true,
		});

		testElement('ic:round-account', {
			inline: false,
			hFlip: true,
		});

		testElement('ic:sharp-account', {
			inline: false,
			vFlip: true,
		});

		testElement('ic:box-account', {
			inline: false,
			vFlip: false,
		});

		testElement('ic:outline-account', {
			inline: false,
		});

		// No more icons
		element = list.shift();
		expect(element).to.be.equal(void 0);
	});

	it('Dimensions', () => {
		const node = getNode('iconify-finder');
		node.innerHTML =
			'This test does not render SVG!<br />' +
			'Block icon:' +
			'    <span class="iconify iconify-inline" data-icon="mdi:home" data-inline="false"></span>' +
			'Width and height:' +
			'    <span class="iconify" data-icon="mdi:account" data-width="24" data-height="24"></span>' +
			'    <span class="iconify" data-icon="mdi:account-box" data-width="100%" data-height="100%"></span>' +
			'Width:' +
			'    <span class="iconify" data-icon="mdi:account-twotone" data-width="32" data-inline="true"></span>' +
			'    <span class="iconify" data-icon="mdi:account-outline" data-width="auto" data-height=""></span>' +
			'Height:' +
			'    <span class="iconify-inline" data-icon="mdi:account-sharp" data-height="2em" data-inline="false"></span>' +
			'    <span class="iconify-inline" data-icon="mdi:account-square" data-height="auto" data-width=""></span>' +
			'';

		// Get icons, convert to array
		const results = finder.find(node);
		const list: Element[] = Array.prototype.slice.call(results, 0);

		function testElement(
			name: string,
			expected: IconifyIconCustomisations
		): void {
			let element = list.shift();
			expect(element).to.not.be.equal(void 0);
			expect(element.getAttribute('data-icon')).to.be.equal(name);
			expect(finder.customisations(element as IconifyElement)).to.be.eql(
				expected
			);
		}

		// Block icon
		let element = list.shift();
		expect(element).to.not.be.equal(void 0);
		expect(element.tagName).to.be.equal('SPAN');
		expect(element.getAttribute('data-icon')).to.be.equal('mdi:home');
		const expected: IconifyIconCustomisations = {
			inline: false,
		};
		expect(finder.customisations(element as IconifyElement)).to.be.eql(
			expected
		);

		// Width and height
		testElement('mdi:account', {
			inline: false,
			width: '24',
			height: '24',
		});

		testElement('mdi:account-box', {
			inline: false,
			width: '100%',
			height: '100%',
		});

		// Width only
		testElement('mdi:account-twotone', {
			inline: true,
			width: '32',
		});

		testElement('mdi:account-outline', {
			inline: false,
			width: 'auto',
		});

		// Height only
		testElement('mdi:account-sharp', {
			inline: false,
			height: '2em',
		});

		testElement('mdi:account-square', {
			inline: true,
			height: 'auto',
		});

		// No more icons
		element = list.shift();
		expect(element).to.be.equal(void 0);
	});

	it('Alignment', () => {
		const node = getNode('iconify-finder');
		node.innerHTML =
			'This test does not render SVG!<br />' +
			'Inline icon:' +
			'    <i class="iconify" data-icon="mdi:home" data-inline="true"></i>' +
			'Alignment:' +
			'    <i class="iconify" data-icon="mdi:account" data-align="left,top"></i>' +
			'    <i class="iconify" data-icon="mdi:account-box" data-align="right,slice"></i>' +
			// 'bottom' overrides 'top', 'center' overrides 'right', extra comma
			'    <i class="iconify-inline" data-icon="mdi:account-outline" data-align="top,right,bottom,meet,center,"></i>' +
			// spaces instead of comma, 'middle' overrides 'bottom'
			'    <i class="iconify iconify-inline" data-icon="mdi:account-twotone" data-align="bottom middle"></i>' +
			'';

		// Get icons, convert to array
		const results = finder.find(node);
		const list: Element[] = Array.prototype.slice.call(results, 0);

		function testElement(
			name: string,
			expected: IconifyIconCustomisations
		): void {
			let element = list.shift();
			expect(element).to.not.be.equal(void 0);
			expect(element.getAttribute('data-icon')).to.be.equal(name);
			expect(finder.customisations(element as IconifyElement)).to.be.eql(
				expected
			);
		}

		// First icon
		let element = list.shift();
		expect(element).to.not.be.equal(void 0);
		expect(element.tagName).to.be.equal('I');
		expect(element.getAttribute('data-icon')).to.be.equal('mdi:home');
		const expected: IconifyIconCustomisations = {
			inline: true,
		};
		expect(finder.customisations(element as IconifyElement)).to.be.eql(
			expected
		);

		// Alignment
		testElement('mdi:account', {
			inline: false,
			hAlign: 'left',
			vAlign: 'top',
		});

		testElement('mdi:account-box', {
			inline: false,
			hAlign: 'right',
			slice: true,
		});

		testElement('mdi:account-outline', {
			inline: true,
			hAlign: 'center',
			vAlign: 'bottom',
			slice: false,
		});

		testElement('mdi:account-twotone', {
			inline: true,
			vAlign: 'middle',
		});

		// No more icons
		element = list.shift();
		expect(element).to.be.equal(void 0);
	});
});
