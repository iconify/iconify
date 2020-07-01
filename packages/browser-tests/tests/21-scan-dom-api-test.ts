import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';
import { addFinder } from '@iconify/iconify/lib/modules/finder';
import { FakeData, setFakeData, prepareQuery, sendQuery } from './fake-api';
import { API } from '@iconify/core/lib/api/';
import { setAPIModule } from '@iconify/core/lib/api/modules';
import { setAPIConfig } from '@iconify/core/lib/api/config';
import { coreModules } from '@iconify/core/lib/modules';
import { finder as iconifyFinder } from '@iconify/iconify/lib/finders/iconify';
import { finder as iconifyIconFinder } from '@iconify/iconify/lib/finders/iconify-icon';
import { setRoot } from '@iconify/iconify/lib/modules/root';
import { scanDOM } from '@iconify/iconify/lib/modules/scanner';

const expect = chai.expect;

// Add finders
addFinder(iconifyFinder);
addFinder(iconifyIconFinder);

// Set API
setAPIModule('', {
	prepare: prepareQuery,
	send: sendQuery,
});
coreModules.api = API;

let prefixCounter = 0;
function nextPrefix(): string {
	return 'scan-dom-api-' + prefixCounter++;
}

describe('Scanning DOM with API', () => {
	it('Scan DOM with API', (done) => {
		const provider = nextPrefix();
		const prefix1 = nextPrefix();
		const prefix2 = nextPrefix();

		// Set fake API hosts to make test reliable
		setAPIConfig(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
		});

		// Set icons, load them with various delay
		const data1: FakeData = {
			icons: ['home', 'account-cash'],
			delay: 100,
			data: {
				prefix: prefix1,
				icons: {
					'account-cash': {
						body:
							'<path d="M11 8c0 2.21-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4m0 6.72V20H0v-2c0-2.21 3.13-4 7-4c1.5 0 2.87.27 4 .72M24 20H13V3h11v17m-8-8.5a2.5 2.5 0 0 1 5 0a2.5 2.5 0 0 1-5 0M22 7a2 2 0 0 1-2-2h-3c0 1.11-.89 2-2 2v9a2 2 0 0 1 2 2h3c0-1.1.9-2 2-2V7z" fill="currentColor"/>',
					},
					'home': {
						body:
							'<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"/>',
					},
				},
				width: 24,
				height: 24,
			},
		};
		setFakeData(provider, prefix1, data1);

		const data2: FakeData = {
			icons: ['account', 'account-box'],
			delay: 500,
			data: {
				prefix: prefix2,
				icons: {
					'account-box': {
						body:
							'<path d="M6 17c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6m9-9a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" fill="currentColor"/>',
					},
					'account': {
						body:
							'<path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" fill="currentColor"/>',
					},
				},
				width: 24,
				height: 24,
			},
		};
		setFakeData(provider, prefix2, data2);

		const node = getNode('scan-dom');
		node.innerHTML =
			'<div><p>Testing scanning DOM with API</p><ul>' +
			'<li>Inline icons:' +
			'   <span class="iconify iconify-inline" data-icon="@' +
			provider +
			':' +
			prefix1 +
			':home" style="color: red; box-shadow: 0 0 2px black;"></span>' +
			'   <i class="iconify-inline test-icon iconify--mdi-account" data-icon="@' +
			provider +
			':' +
			prefix2 +
			':account" style="vertical-align: 0;" data-flip="horizontal" aria-hidden="false"></i>' +
			'</li>' +
			'<li>Block icons:' +
			'   <iconify-icon data-icon="@' +
			provider +
			':' +
			prefix1 +
			':account-cash" title="&lt;Cash&gt;!"></iconify-icon>' +
			'   <i class="iconify-icon" data-icon="@' +
			provider +
			':' +
			prefix2 +
			':account-box" data-inline="true" data-rotate="2" data-width="42"></i>' +
			'</li>' +
			'</ul></div>';

		setRoot(node);

		scanDOM();

		// First API response should have loaded
		setTimeout(() => {
			const elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(
				2,
				'Expected to find 2 rendered SVG elements'
			);
		}, 200);

		// Second API response should have loaded
		setTimeout(() => {
			const elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(
				4,
				'Expected to find 4 rendered SVG elements'
			);
			done();
		}, 700);
	});

	it('Changing icon name before it loaded', (done) => {
		const provider = nextPrefix();
		const prefix1 = nextPrefix();
		const prefix2 = nextPrefix();

		// Set fake API hosts to make test reliable
		setAPIConfig(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
		});

		// Set icons, load them with various delay
		const data1: FakeData = {
			icons: ['home', 'account-cash'],
			delay: 100,
			data: {
				prefix: prefix1,
				icons: {
					'account-cash': {
						body:
							'<path d="M11 8c0 2.21-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4m0 6.72V20H0v-2c0-2.21 3.13-4 7-4c1.5 0 2.87.27 4 .72M24 20H13V3h11v17m-8-8.5a2.5 2.5 0 0 1 5 0a2.5 2.5 0 0 1-5 0M22 7a2 2 0 0 1-2-2h-3c0 1.11-.89 2-2 2v9a2 2 0 0 1 2 2h3c0-1.1.9-2 2-2V7z" fill="currentColor"/>',
					},
					'home': {
						body:
							'<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"/>',
					},
				},
				width: 24,
				height: 24,
			},
		};
		setFakeData(provider, prefix1, data1);

		const data2: FakeData = {
			icons: ['account', 'account-box'],
			delay: 500,
			data: {
				prefix: prefix2,
				icons: {
					'account-box': {
						body:
							'<path d="M6 17c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6m9-9a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" fill="currentColor"/>',
					},
					'account': {
						body:
							'<path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" fill="currentColor"/>',
					},
				},
				width: 24,
				height: 24,
			},
		};
		setFakeData(provider, prefix2, data2);

		const data1b: FakeData = {
			icons: ['account', 'account-box'],
			delay: 800, // +100ms for first query
			data: {
				prefix: prefix1,
				icons: {
					'account-box': {
						body:
							'<path d="M6 17c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6m9-9a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" fill="currentColor"/>',
					},
					'account': {
						body:
							'<path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" fill="currentColor"/>',
					},
				},
				width: 24,
				height: 24,
			},
		};
		setFakeData(provider, prefix1, data1b);

		const node = getNode('scan-dom');
		node.innerHTML =
			'<div><p>Testing scanning DOM with API: renamed icon</p><ul>' +
			'<li>Default finder:' +
			'   <span class="iconify-inline first-icon" data-icon="@' +
			provider +
			':' +
			prefix1 +
			':home" style="color: red; box-shadow: 0 0 2px black;"></span>' +
			'   <i class="iconify-inline second-icon iconify--mdi-account" data-icon="@' +
			provider +
			':' +
			prefix2 +
			':account" style="vertical-align: 0;" data-flip="horizontal" aria-hidden="false"></i>' +
			'</li>' +
			'<li>IconifyIcon finder:' +
			'   <iconify-icon class="third-icon" data-icon="@' +
			provider +
			':' +
			prefix1 +
			':account-cash" title="&lt;Cash&gt;!"></iconify-icon>' +
			'   <iconify-icon class="fourth-icon" data-icon="@' +
			provider +
			':' +
			prefix2 +
			':account-box" data-inline="true" data-rotate="2" data-width="42"></iconify-icon>' +
			'</li>' +
			'</ul></div>';

		setRoot(node);

		scanDOM();

		// Make sure no icons were rendered yet
		const elements = node.querySelectorAll('svg.iconify');
		expect(elements.length).to.be.equal(
			0,
			'Expected to find 0 rendered SVG elements'
		);

		// Change icon name
		const icon = node.querySelector('iconify-icon[title]');
		expect(icon).to.not.be.equal(null);
		expect(icon.getAttribute('class')).to.be.equal('third-icon');
		icon.setAttribute(
			'data-icon',
			'@' + provider + ':' + prefix1 + ':account'
		);

		// First API response should have loaded, but only 1 icon should have been rendered
		setTimeout(() => {
			// Loaded for prefix1: account-cash, home
			// Loaded for prefix2: -
			const elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(1, '200ms delay error');
		}, 200);

		// Second API response should have loaded
		setTimeout(() => {
			// Loaded for prefix1: account-cash, home
			// Loaded for prefix2: account, account-box
			const elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(3, '700ms delay error');
		}, 700);

		// Renamed icon from first API response
		setTimeout(() => {
			// Loaded for prefix1: account-cash, home, account-box, account
			// Loaded for prefix2: account, account-box
			const elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(4, '1000ms delay error');
			done();
		}, 1100);
	});

	it('Changing icon name before it loaded to invalid name', (done) => {
		const provider = nextPrefix();
		const prefix1 = nextPrefix();
		const prefix2 = nextPrefix();

		// Set fake API hosts to make test reliable
		setAPIConfig(provider, {
			resources: ['https://api1.local', 'https://api2.local'],
		});

		// Set icons, load them with various delay
		const data1: FakeData = {
			icons: ['home', 'account-cash'],
			delay: 100,
			data: {
				prefix: prefix1,
				icons: {
					'account-cash': {
						body:
							'<path d="M11 8c0 2.21-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4m0 6.72V20H0v-2c0-2.21 3.13-4 7-4c1.5 0 2.87.27 4 .72M24 20H13V3h11v17m-8-8.5a2.5 2.5 0 0 1 5 0a2.5 2.5 0 0 1-5 0M22 7a2 2 0 0 1-2-2h-3c0 1.11-.89 2-2 2v9a2 2 0 0 1 2 2h3c0-1.1.9-2 2-2V7z" fill="currentColor"/>',
					},
					'home': {
						body:
							'<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"/>',
					},
				},
				width: 24,
				height: 24,
			},
		};
		setFakeData(provider, prefix1, data1);

		const data2: FakeData = {
			icons: ['account', 'account-box'],
			delay: 500,
			data: {
				prefix: prefix2,
				icons: {
					'account-box': {
						body:
							'<path d="M6 17c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6m9-9a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" fill="currentColor"/>',
					},
					'account': {
						body:
							'<path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" fill="currentColor"/>',
					},
				},
				width: 24,
				height: 24,
			},
		};
		setFakeData(provider, prefix2, data2);

		const node = getNode('scan-dom');
		node.innerHTML =
			'<div><p>Testing scanning DOM with API: invalid name</p><ul>' +
			'<li>Inline icons:' +
			'   <span class="iconify" data-icon="@' +
			provider +
			':' +
			prefix1 +
			':home" style="color: red; box-shadow: 0 0 2px black;"></span>' +
			'   <i class="iconify test-icon iconify--mdi-account" data-icon="@' +
			provider +
			':' +
			prefix2 +
			':account" style="vertical-align: 0;" data-flip="horizontal" aria-hidden="false"></i>' +
			'</li>' +
			'<li>Block icons:' +
			'   <iconify-icon data-icon="@' +
			provider +
			':' +
			prefix1 +
			':account-cash" title="&lt;Cash&gt;!"></iconify-icon>' +
			'   <iconify-icon data-icon="@' +
			provider +
			':' +
			prefix2 +
			':account-box" data-inline="true" data-rotate="2" data-width="42"></iconify-icon>' +
			'</li>' +
			'</ul></div>';

		setRoot(node);

		scanDOM();

		// Change icon name
		const icon = node.querySelector('iconify-icon[title]');
		expect(icon).to.not.be.equal(null);
		icon.setAttribute('data-icon', '@' + provider + ':foo');

		// First API response should have loaded, but only 1 icon
		setTimeout(() => {
			const elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(1);
		}, 200);

		// Second API response should have loaded
		setTimeout(() => {
			const elements = node.querySelectorAll('svg.iconify');
			expect(elements.length).to.be.equal(3);
			done();
		}, 700);
	});
});
