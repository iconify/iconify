import { trimSVG } from '../lib/svg/trim';
import { svgToURL } from '../lib/svg/url';

describe('Testing generating url()', () => {
	// To make sure it works in browser, log variable `url` and test in actual CSS
	test('Simple icon', () => {
		const html =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h16v16z" fill="#f80" /></svg>';
		const url = svgToURL(html);
		expect(url).toBe(
			"url(\"data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M0 0h16v16z' fill='%23f80' %2F%3E%3C%2Fsvg%3E\")"
		);
	});

	test('Icon with style', () => {
		const html =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><style>path { fill: #f80; }</style><path d="M0 0h16v16z" /></svg>';
		const url = svgToURL(html);
		expect(url).toBe(
			"url(\"data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cstyle%3Epath { fill%3A %23f80; }%3C%2Fstyle%3E%3Cpath d='M0 0h16v16z' %2F%3E%3C%2Fsvg%3E\")"
		);
	});

	test('Icon with +', () => {
		const html = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect x="2" y="2" width="20" height="10" fill="currentColor">
		<animate id="animation1" attributeName="height" values="10;5" dur="0.5s" fill="freeze" />
		<animate id="animation2" attributeName="width" values="20;5" dur="0.2s" begin="animation1.end+1s" fill="freeze" />
	</rect>
	<rect x="2" y="12" width="20" height="5" fill="currentColor">
		<animate attributeName="height" values="5;10;5" begin="animation1.end+0.2s;animation2.end-0.2s" dur="0.3s" />
	</rect>
</svg>`;
		const url = svgToURL(trimSVG(html));
		expect(url).toBe(
			"url(\"data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect x='2' y='2' width='20' height='10' fill='currentColor'%3E%3Canimate id='animation1' attributeName='height' values='10;5' dur='0.5s' fill='freeze'%2F%3E%3Canimate id='animation2' attributeName='width' values='20;5' dur='0.2s' begin='animation1.end+1s' fill='freeze'%2F%3E%3C%2Frect%3E%3Crect x='2' y='12' width='20' height='5' fill='currentColor'%3E%3Canimate attributeName='height' values='5;10;5' begin='animation1.end+0.2s;animation2.end-0.2s' dur='0.3s'%2F%3E%3C%2Frect%3E%3C%2Fsvg%3E\")"
		);
	});

	test('Does not leak a literal "http://" or "https://" substring', () => {
		// Regression test: some reverse proxies blindly rewrite every "http://"
		// occurrence in served text to "https://" to avoid mixed content
		// warnings. An unescaped ':' or '/' would let a literal "http://" survive
		// inside the encoded SVG (most commonly from an injected
		// `xmlns="http://www.w3.org/2000/svg"`), where such a rewrite would
		// corrupt it and break the SVG namespace.
		const html =
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h16v16z" /></svg>';
		const url = svgToURL(html);
		expect(url).not.toContain('http://');
		expect(url).not.toContain('https://');
	});
});
