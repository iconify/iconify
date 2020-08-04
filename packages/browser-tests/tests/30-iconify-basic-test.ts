import mocha from 'mocha';
import chai from 'chai';

import { getNode } from './node';
import Iconify from '@iconify/iconify/lib/iconify';

const expect = chai.expect;

const selector =
	'span.iconify, i.iconify, span.iconify-inline, i.iconify-inline';

const node1 = getNode('iconify-basic');
const node2 = getNode('iconify-basic');

// Do not observe document.body!
Iconify.stopObserving(document.body);

// Set root node
Iconify.observe(node1);

describe('Testing Iconify object', () => {
	const prefix = 'invalid-' + Date.now();

	// Add mentioned icons to storage
	Iconify.addCollection({
		prefix,
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

	// Add one icon separately
	Iconify.addIcon(prefix + ':id-test', {
		body:
			'<defs><path id="ssvg-id-1st-place-medala" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medald" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalf" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalh" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalj" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalm" d="M.93.01h120.55v58.36H.93z"/><path d="M52.849 78.373v-3.908c3.681-.359 6.25-.958 7.703-1.798c1.454-.84 2.54-2.828 3.257-5.962h4.021v40.385h-5.437V78.373h-9.544z" id="ssvg-id-1st-place-medalp"/><linearGradient x1="49.998%" y1="-13.249%" x2="49.998%" y2="90.002%" id="ssvg-id-1st-place-medalb"><stop stop-color="#1E88E5" offset="13.55%"/><stop stop-color="#1565C0" offset="93.8%"/></linearGradient><linearGradient x1="26.648%" y1="2.735%" x2="77.654%" y2="105.978%" id="ssvg-id-1st-place-medalk"><stop stop-color="#64B5F6" offset="13.55%"/><stop stop-color="#2196F3" offset="94.62%"/></linearGradient><radialGradient cx="22.368%" cy="12.5%" fx="22.368%" fy="12.5%" r="95.496%" id="ssvg-id-1st-place-medalo"><stop stop-color="#FFEB3B" offset="29.72%"/><stop stop-color="#FBC02D" offset="95.44%"/></radialGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalc" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medala"/></mask><path fill="url(#ssvg-id-1st-place-medalb)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalc)" d="M45.44 42.18h31.43l30-48.43H75.44z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medale" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medald"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medale)" fill="#424242" fill-rule="nonzero"><path d="M101.23-3L75.2 39H50.85L77.11-3h24.12zm5.64-3H75.44l-30 48h31.42l30.01-48z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalg" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalf"/></mask><path d="M79 30H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z" fill="#FDD835" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalg)"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medali" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalh"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medali)" fill="#424242" fill-rule="nonzero"><path d="M79 32c3.31 0 6 2.69 6 6v16.04A2.006 2.006 0 0 1 82.59 56c-1.18-.23-2.59-1.35-2.59-2.07V44c0-2.21-1.79-4-4-4H46c-2.21 0-4 1.79-4 4v10.04c0 .88-1.64 1.96-2.97 1.96c-1.12-.01-2.03-.89-2.03-1.96V38c0-3.31 2.69-6 6-6h36zm0-2H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medall" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalj"/></mask><path fill="url(#ssvg-id-1st-place-medalk)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medall)" d="M76.87 42.18H45.44l-30-48.43h31.43z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medaln" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalm"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medaln)" fill="#424242" fill-rule="nonzero"><path d="M45.1-3l26.35 42H47.1L20.86-3H45.1zm1.77-3H15.44l30 48h31.42L46.87-6z"/></g></g><circle fill="url(#ssvg-id-1st-place-medalo)" fill-rule="nonzero" cx="64" cy="86" r="38"/><path d="M64 51c19.3 0 35 15.7 35 35s-15.7 35-35 35s-35-15.7-35-35s15.7-35 35-35zm0-3c-20.99 0-38 17.01-38 38s17.01 38 38 38s38-17.01 38-38s-17.01-38-38-38z" opacity=".2" fill="#424242" fill-rule="nonzero"/><path d="M47.3 63.59h33.4v44.4H47.3z"/><use fill="#000" xlink:href="#ssvg-id-1st-place-medalp"/><use fill="#FFA000" xlink:href="#ssvg-id-1st-place-medalp"/></g>',
		width: 128,
		height: 128,
	});

	it('Check iconExists', () => {
		expect(Iconify.iconExists(prefix + ':' + 'account')).to.be.equal(true);
		expect(Iconify.iconExists(prefix + ':' + 'missing')).to.be.equal(false);
		expect(Iconify.iconExists(prefix + '-123:' + 'missing')).to.be.equal(
			false
		);
	});

	it('Get SVG node', () => {
		const node = Iconify.renderSVG(prefix + ':account', {
			inline: true,
		});
		expect(node).to.not.be.equal(null);

		const html = node.outerHTML;
		expect(html.indexOf('<svg')).to.be.equal(0);

		// Get HTML
		const html2 = Iconify.renderHTML(prefix + ':account', {
			inline: true,
		});
		expect(html2).to.be.equal(html);
	});

	it('Rendering icons without API', (done) => {
		node1.innerHTML =
			'<div><p>Testing Iconify without API</p>' +
			'   <span class="iconify-inline" data-icon="' +
			prefix +
			':home" style="color: red; box-shadow: 0 0 2px black;"></span>' +
			'   <i class="iconify-inline test-icon iconify--mdi-account" data-icon="' +
			prefix +
			':account" style="vertical-align: 0;" data-flip="horizontal" aria-hidden="false"></i>' +
			'   <i class="iconify" data-icon="' +
			prefix +
			':account-cash" title="&lt;Cash&gt;!"></i>' +
			'   <span class="iconify" data-icon="' +
			prefix +
			':account-box" data-inline="true" data-rotate="2" data-width="42"></span>' +
			'   <span class="iconify" data-icon="' +
			prefix +
			':id-test"></span>' +
			'</div>';

		node2.innerHTML =
			'<div><p>This node should not be replaced</p>' +
			'<span class="iconify" data-icon="' +
			prefix +
			':home" style="color: red; box-shadow: 0 0 2px black;"></span>';

		// Icons should not have been replaced yet
		let list = node1.querySelectorAll(selector);
		expect(list.length).to.be.equal(5);

		list = node2.querySelectorAll(selector);
		expect(list.length).to.be.equal(1);

		// Check in ticks
		setTimeout(() => {
			setTimeout(() => {
				list = node1.querySelectorAll(selector);
				expect(list.length).to.be.equal(0);

				list = node2.querySelectorAll(selector);
				expect(list.length).to.be.equal(1);

				// Test SVG with ID
				const idTest = node1.querySelector('#ssvg-id-1st-place-medala');
				expect(idTest).to.be.equal(null, 'Expecting ID to be replaced');

				done();
			});
		});
	});
});
