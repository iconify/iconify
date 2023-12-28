import { prettifySVG } from '../lib/svg/pretty';

describe('Prettify SVG', () => {
	test('Basic XML', () => {
		expect(
			prettifySVG(
				'<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="50"></circle></svg>'
			)
		).toBe(
			'<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">\n\t<circle cx="60" cy="60" r="50">\n\t</circle>\n</svg>\n'
		);

		// Self closing tag
		expect(
			prettifySVG(
				'<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="50"/></svg>'
			)
		).toBe(
			'<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">\n\t<circle cx="60" cy="60" r="50" />\n</svg>\n'
		);

		// With xml tag
		expect(
			prettifySVG(
				'<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">\n<circle cx="60" cy="60" r="50"/>\n</svg>\n\t'
			)
		).toBe(
			'<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">\n\t<circle cx="60" cy="60" r="50" />\n</svg>\n'
		);
	});

	test('Text', () => {
		expect(prettifySVG('<svg><title>Trimmed Text</title></svg>')).toBe(
			'<svg>\n\t<title>Trimmed Text</title>\n</svg>\n'
		);

		expect(
			prettifySVG('<svg><title> Right Trimmed Text</title></svg>')
		).toBe('<svg>\n\t<title> Right Trimmed Text</title>\n</svg>\n');

		expect(
			prettifySVG('<svg><title>Left Trimmed Text </title></svg>')
		).toBe('<svg>\n\t<title>Left Trimmed Text </title>\n</svg>\n');

		expect(prettifySVG('<svg><title> Text </title></svg>')).toBe(
			'<svg>\n\t<title>\n\t\tText\n\t</title>\n</svg>\n'
		);
	});

	test('Style and script', () => {
		// Basic CSS
		expect(
			prettifySVG('<svg><style>path { stroke-width: 1; }</style></svg>')
		).toBe('<svg>\n\t<style>path { stroke-width: 1; }</style>\n</svg>\n');

		// Basic script
		expect(
			prettifySVG(
				'<svg><script lang="foo"> console.log(\'Alert\'); </script></svg>'
			)
		).toBe(
			'<svg>\n\t<script lang="foo"> console.log(\'Alert\'); </script>\n</svg>\n'
		);

		// Selector with '>' and tag after that
		expect(
			prettifySVG(
				'<svg><style>g > path { stroke-width: 1; }</style><g></g></svg>'
			)
		).toBe(
			'<svg>\n\t<style>g > path { stroke-width: 1; }</style>\n\t<g>\n\t</g>\n</svg>\n'
		);
	});

	test('Bad code', () => {
		expect(prettifySVG('<svg><title>Incomplete SVG</title>')).toBeNull();
		expect(
			prettifySVG('<svg><title>Incomplete SVG</title>/svg>')
		).toBeNull();
		expect(
			prettifySVG('<svg><title>Incomplete SVG</title></g></svg>')
		).toBeNull();
		expect(
			prettifySVG('<svg><title>Unescaped < text</title></svg>')
		).toBeNull();
		expect(
			prettifySVG('<svg><title>Unescaped > text</title></svg>')
		).toBeNull();
		expect(
			prettifySVG('<svg><title foo=">">Unescaped attr</title></svg>')
		).toBeNull();
		expect(
			prettifySVG('<svg><title foo="<">Unescaped attr</title></svg>')
		).toBeNull();
	});
});
