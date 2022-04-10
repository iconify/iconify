import { svgToURL } from '../lib/svg/url';

describe('Testing generating url()', () => {
	// To make sure it works in browser, log variable `url` and test in actual CSS
	test('Simple icon', () => {
		const html =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h16v16z" fill="#f80" /></svg>';
		const url = svgToURL(html);
		expect(url).toBe(
			"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M0 0h16v16z' fill='%23f80' /%3E%3C/svg%3E\")"
		);
	});

	test('Icon with style', () => {
		const html =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><style>path { fill: #f80; }</style><path d="M0 0h16v16z" /></svg>';
		const url = svgToURL(html);
		expect(url).toBe(
			"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cstyle%3Epath { fill: %23f80; }%3C/style%3E%3Cpath d='M0 0h16v16z' /%3E%3C/svg%3E\")"
		);
	});
});
