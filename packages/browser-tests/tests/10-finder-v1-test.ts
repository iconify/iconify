import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';
import { addFinder, findPlaceholders } from '@iconify/iconify/lib/finder';
import { IconifyFinder } from '@iconify/iconify/lib/interfaces/finder';
import { finder as iconifyFinder } from '@iconify/iconify/lib/finders/iconify-v1';
import { finder as iconifyIconFinder } from '@iconify/iconify/lib/finders/iconify-v1-icon';
import { IconifyIconName } from '@iconify/core/lib/icon/name';

const expect = chai.expect;

// Add finders
addFinder(iconifyFinder);
addFinder(iconifyIconFinder);

describe('Testing legacy finder', () => {
	it('Finding nodes', () => {
		const node = getNode('finder');
		node.innerHTML =
			'<div><p>List of <span>icons</span></p><ul>' +
			'<li>Valid icons:' +
			'   <span class="iconify" data-icon="mdi:home"></span>' +
			'   <i class="iconify" data-icon="mdi:account"></i>' +
			'</li>' +
			'<li>Icon without name:' +
			'   <span class="iconify"></span>' +
			'</li>' +
			'<li>Block icon:' +
			'   <iconify-icon data-icon="ic:baseline-account"></iconify-icon>' +
			'</li>' +
			'<li>Icon with wrong tag: <p class="iconify" data-icon="mdi:alert"></p></li>' +
			'</ul></div>';

		const items = findPlaceholders(node);

		function testIcon(
			name: IconifyIconName | null,
			expectedFinder: IconifyFinder
		): void {
			const item = items.shift();
			expect(item.name).to.be.eql(name);
			expect(item.finder).to.be.equal(expectedFinder);
		}

		// Test all icons
		testIcon(
			{
				prefix: 'mdi',
				name: 'home',
			},
			iconifyFinder
		);

		testIcon(
			{
				prefix: 'mdi',
				name: 'account',
			},
			iconifyFinder
		);

		testIcon(
			{
				prefix: 'ic',
				name: 'baseline-account',
			},
			iconifyIconFinder
		);

		// End of list
		expect(items.shift()).to.be.equal(void 0);
	});
});
