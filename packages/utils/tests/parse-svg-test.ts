import { IconifyIconBuildResult } from '../lib/svg/build';
import {
	parseSVGContent,
	buildParsedSVG,
	convertParsedSVG,
} from '../lib/svg/parse';
import { splitSVGDefs } from '../lib/svg/defs';
import { getSVGViewBox } from '../lib/svg/viewbox';
import { readFileSync } from 'node:fs';
import { IconifyIcon } from '@iconify/types';

const fixturesDir = './tests/fixtures';

describe('Testing parsing SVG content', () => {
	test('Getting viewBox', () => {
		// Valid numbers
		expect(getSVGViewBox('1 2 3 4')).toEqual([1, 2, 3, 4]);
		expect(getSVGViewBox('-1 0 25.5 -123.5')).toEqual([
			-1, 0, 25.5, -123.5,
		]);
		expect(getSVGViewBox('  1\t2   3\n4\t ')).toEqual([1, 2, 3, 4]);

		// Bad numbers
		expect(getSVGViewBox('1 2 3')).toBeUndefined();
		expect(getSVGViewBox('1 2 3 4 5')).toBeUndefined();
		expect(getSVGViewBox('a 1 2 3')).toBeUndefined();
		expect(getSVGViewBox('0 1 2 b')).toBeUndefined();
		expect(getSVGViewBox('1 2 3 4b')).toBeUndefined();
	});

	test('Simple SVG', () => {
		const body =
			'<path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21" opacity="0"><animate id="spinner_jbAr" begin="0;spinner_8ff3.end+0.2s" attributeName="opacity" calcMode="discrete" dur="0.25s" values="0;1" fill="freeze"/><animate id="spinner_8ff3" begin="spinner_aTlH.end+0.5s" attributeName="opacity" dur="0.001s" values="1;0" fill="freeze"/></path><path d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z" opacity="0"><animate id="spinner_dof4" begin="spinner_jbAr.end" attributeName="opacity" calcMode="discrete" dur="0.25s" values="0;1" fill="freeze"/><animate begin="spinner_aTlH.end+0.5s" attributeName="opacity" dur="0.001s" values="1;0" fill="freeze"/></path><path d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3" opacity="0"><animate id="spinner_aTlH" begin="spinner_dof4.end" attributeName="opacity" calcMode="discrete" dur="0.25s" values="0;1" fill="freeze"/><animate begin="spinner_aTlH.end+0.5s" attributeName="opacity" dur="0.001s" values="1;0" fill="freeze"/></path>';
		const svg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

		// Parse
		const parsed = parseSVGContent(svg);
		expect(parsed).toBeTruthy();
		if (!parsed) {
			return;
		}
		expect(parsed.attribs).toEqual({
			width: '24',
			height: '24',
			viewBox: '0 0 24 24',
			xmlns: 'http://www.w3.org/2000/svg',
		});
		expect(parsed.body).toEqual(body);

		// Build
		const built = buildParsedSVG(parsed);
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '24',
				height: '24',
				viewBox: '0 0 24 24',
			},
			viewBox: [0, 0, 24, 24],
			body,
		};
		expect(built).toEqual(expected);

		const icon = convertParsedSVG(parsed);
		const expectedIcon: IconifyIcon = {
			left: 0,
			top: 0,
			width: 24,
			height: 24,
			body,
		};
		expect(icon).toEqual(expectedIcon);

		// Defs
		expect(splitSVGDefs(body)).toEqual({
			defs: '',
			content: body,
		});
	});

	test('SVG with XML heading', () => {
		const svg = readFileSync(
			fixturesDir + '/circle-xml-preface.svg',
			'utf8'
		);
		const body = '<circle cx="60" cy="60" r="50"/>';

		// Parse
		const parsed = parseSVGContent(svg);
		expect(parsed).toBeTruthy();
		if (!parsed) {
			return;
		}
		expect(parsed?.attribs).toEqual({
			viewBox: '0 0 120 120',
			xmlns: 'http://www.w3.org/2000/svg',
		});
		expect(parsed.body).toEqual(body);

		// Build
		const built = buildParsedSVG(parsed);
		const expected: IconifyIconBuildResult = {
			attributes: {
				viewBox: '0 0 120 120',
			},
			viewBox: [0, 0, 120, 120],
			body,
		};
		expect(built).toEqual(expected);

		// Defs
		expect(splitSVGDefs(body)).toEqual({
			defs: '',
			content: body,
		});
	});

	test('SVG with style and junk', () => {
		const body1 =
			'<metadata id="metadata8"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/></cc:Work></rdf:RDF></metadata>';
		const defs1 =
			'<clipPath id="clipPath16" clipPathUnits="userSpaceOnUse"><path id="path18" d="M 0,38 38,38 38,0 0,0 0,38 Z"/></clipPath>';
		const body2 =
			'<g transform="matrix(1.25,0,0,-1.25,0,47.5)" id="g10"><g id="g12"><g clip-path="url(#clipPath16)" id="g14"><g transform="translate(37,3)" id="g20"><path id="path22" style="fill:#ffcc4d;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c 0,-1.104 -0.896,-2 -2,-2 l -32,0 c -1.104,0 -2,0.896 -2,2 l 0,19 c 0,1.104 0.896,2 2,2 l 32,0 c 1.104,0 2,-0.896 2,-2 L 0,0 Z"/></g><g transform="translate(35,24)" id="g24"><path id="path26" style="fill:#6d6e71;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 -32,0 c -1.104,0 -2,-0.896 -2,-2 L 2,-2 C 2,-0.896 1.104,0 0,0"/></g><path id="path28" style="fill:#3b88c3;fill-opacity:1;fill-rule:nonzero;stroke:none" d="M 35,9 3,9 3,13 35,13 35,9 Z"/><path id="path30" style="fill:#3b88c3;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 35,15 -32,0 0,4 32,0 0,-4 z"/><path id="path32" style="fill:#3b88c3;fill-opacity:1;fill-rule:nonzero;stroke:none" d="M 35,3 3,3 3,7 35,7 35,3 Z"/><path id="path34" style="fill:#ffcc4d;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 31,2 -2,0 0,18 2,0 0,-18 z"/><g transform="translate(23,37)" id="g36"><path id="path38" style="fill:#ffe8b6;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 -16,0 c -1.104,0 -2,-0.896 -2,-2 l 0,-34 20,0 0,34 C 2,-0.896 1.104,0 0,0"/></g><g transform="translate(23,37)" id="g40"><path id="path42" style="fill:#808285;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 -16,0 c -1.104,0 -2,-0.896 -2,-2 L 2,-2 C 2,-0.896 1.104,0 0,0"/></g><path id="path44" style="fill:#55acee;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 23,15 -16,0 0,4 16,0 0,-4 z"/><path id="path46" style="fill:#55acee;fill-opacity:1;fill-rule:nonzero;stroke:none" d="M 23,9 7,9 7,13 23,13 23,9 Z"/><path id="path48" style="fill:#55acee;fill-opacity:1;fill-rule:nonzero;stroke:none" d="M 23,3 7,3 7,7 23,7 23,3 Z"/><path id="path50" style="fill:#ffe8b6;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 13,1 -2,0 0,29 2,0 0,-29 z"/><path id="path52" style="fill:#ffe8b6;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 19,1 -2,0 0,29 2,0 0,-29 z"/><path id="path54" style="fill:#226699;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 17,1 -4,0 0,6 4,0 0,-6 z"/><g transform="translate(21,28)" id="g56"><path id="path58" style="fill:#a7a9ac;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c 0,-3.313 -2.687,-6 -6,-6 -3.313,0 -6,2.687 -6,6 0,3.313 2.687,6 6,6 3.313,0 6,-2.687 6,-6"/></g><g transform="translate(19,28)" id="g60"><path id="path62" style="fill:#e6e7e8;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c 0,-2.209 -1.791,-4 -4,-4 -2.209,0 -4,1.791 -4,4 0,2.209 1.791,4 4,4 2.209,0 4,-1.791 4,-4"/></g><g transform="translate(18,27)" id="g64"><path id="path66" style="fill:#a0041e;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 -3,0 c -0.552,0 -1,0.448 -1,1 l 0,5 c 0,0.552 0.448,1 1,1 0.552,0 1,-0.448 1,-1 L -2,2 0,2 C 0.552,2 1,1.552 1,1 1,0.448 0.552,0 0,0"/></g></g></g></g>';
		const body = `${body1}<defs id="defs6">${defs1}</defs>${body2}`;
		const svg = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 47.5 49.5" style="enable-background:new 0 -1 47.5 49.5;" xml:space="preserve" version="1.1" id="svg2">
    ${body}
</svg>`;

		// Parse
		const parsed = parseSVGContent(svg);
		expect(parsed).toBeTruthy();
		if (!parsed) {
			return;
		}
		expect(parsed?.attribs).toEqual({
			'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
			'xmlns:cc': 'http://creativecommons.org/ns#',
			'xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'xmlns:svg': 'http://www.w3.org/2000/svg',
			'xmlns': 'http://www.w3.org/2000/svg',
			'viewBox': '0 -1 47.5 49.5',
			'style': 'enable-background:new 0 -1 47.5 49.5;',
			'xml:space': 'preserve',
			'version': '1.1',
			'id': 'svg2',
		});
		expect(parsed.body).toEqual(body);

		// Build
		const built = buildParsedSVG(parsed);
		const expected: IconifyIconBuildResult = {
			attributes: {
				viewBox: '0 -1 47.5 49.5',
			},
			viewBox: [0, -1, 47.5, 49.5],
			body: `<defs>${defs1}</defs><g style="enable-background:new 0 -1 47.5 49.5;">${body1}${body2}</g>`,
		};
		expect(built).toEqual(expected);

		const icon = convertParsedSVG(parsed);
		const expectedIcon: IconifyIcon = {
			left: 0,
			top: -1,
			width: 47.5,
			height: 49.5,
			body: expected.body,
		};
		expect(icon).toEqual(expectedIcon);

		// Defs
		expect(splitSVGDefs(body)).toEqual({
			defs: defs1,
			content: body1 + body2,
		});
	});

	test('SVG with fill', () => {
		const body = `<g filter="url(#filter0_iii_18_1526)">
            <path d="M14.0346 3.55204L18.2991 10.8362L12.2834 12.5469C8.12828 11.172 5.68075 8.52904 4.20532 5.8125C3.58307 4.66681 3.58813 2.5625 6.06108 2.5625H12.3087C13.0189 2.5625 13.6758 2.93914 14.0346 3.55204Z" fill="#4686EC"/>
            <path d="M14.0346 3.55204L18.2991 10.8362L12.2834 12.5469C8.12828 11.172 5.68075 8.52904 4.20532 5.8125C3.58307 4.66681 3.58813 2.5625 6.06108 2.5625H12.3087C13.0189 2.5625 13.6758 2.93914 14.0346 3.55204Z" fill="url(#paint0_radial_18_1526)"/>
            <path d="M14.0346 3.55204L18.2991 10.8362L12.2834 12.5469C8.12828 11.172 5.68075 8.52904 4.20532 5.8125C3.58307 4.66681 3.58813 2.5625 6.06108 2.5625H12.3087C13.0189 2.5625 13.6758 2.93914 14.0346 3.55204Z" fill="url(#paint1_linear_18_1526)"/>
            </g>
    `;
		const svg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

		// Parse
		const parsed = parseSVGContent(svg);
		expect(parsed).toBeTruthy();
		if (!parsed) {
			return;
		}
		expect(parsed?.attribs).toEqual({
			width: '32',
			height: '32',
			viewBox: '0 0 32 32',
			fill: 'none',
			xmlns: 'http://www.w3.org/2000/svg',
		});
		expect(parsed.body).toEqual(body.trim());

		// Build
		const built = buildParsedSVG(parsed);
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '32',
				height: '32',
				viewBox: '0 0 32 32',
			},
			viewBox: [0, 0, 32, 32],
			body: `<g fill="none">${body.trim()}</g>`,
		};
		expect(built).toEqual(expected);
	});

	test('Nested SVG', () => {
		const body = `<circle cx="50" cy="50" r="40" />
		<circle cx="150" cy="50" r="4" />
	  
		<svg viewBox="0 0 10 10" x="200" width="100">
		  <circle cx="5" cy="5" r="4" />
		</svg>`;

		const parsed = parseSVGContent(`<svg
		viewBox="0 0 300 100"
		xmlns="http://www.w3.org/2000/svg"
		stroke="red"
		fill="grey">
		${body}
	  </svg>
	  `);

		expect(parsed).toBeTruthy();
		if (!parsed) {
			return;
		}

		expect(parsed.attribs).toEqual({
			viewBox: '0 0 300 100',
			xmlns: 'http://www.w3.org/2000/svg',
			stroke: 'red',
			fill: 'grey',
		});
		expect(parsed.body).toEqual(body);
	});
});
