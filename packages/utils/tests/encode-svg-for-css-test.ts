import { encodeSvgForCss } from '../lib/svg/encode-svg-for-css';

describe('Encoding SVG for CSS', () => {
	test('Injects xmlns when missing', () => {
		const svg =
			'<svg viewBox="0 0 16 16" width="16" height="16"><path d="M0 0h16v16z" /></svg>';
		expect(encodeSvgForCss(svg)).toBe(
			"%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox='0 0 16 16' width='16' height='16'%3E%3Cpath d='M0 0h16v16z' %2F%3E%3C%2Fsvg%3E"
		);
	});

	test('Injects xmlns:xlink when xlink: is used', () => {
		const svg = '<svg viewBox="0 0 16 16"><use xlink:href="#icon" /></svg>';
		expect(encodeSvgForCss(svg)).toBe(
			"%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' xmlns%3Axlink='http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink' viewBox='0 0 16 16'%3E%3Cuse xlink%3Ahref='%23icon' %2F%3E%3C%2Fsvg%3E"
		);
	});

	test('Does not touch an existing xmlns', () => {
		const svg =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M0 0h16v16z" /></svg>';
		expect(encodeSvgForCss(svg)).toBe(
			"%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox='0 0 16 16'%3E%3Cpath d='M0 0h16v16z' %2F%3E%3C%2Fsvg%3E"
		);
	});

	test('Regression: never leaks a literal "http://" or "https://" substring', () => {
		// This is the bug this escaping fixes: some reverse proxies blindly
		// rewrite every "http://" occurrence in served text to "https://" to
		// avoid mixed content warnings. Since icon sets normally don't carry
		// their own xmlns, encodeSvgForCss injects
		// `xmlns="http://www.w3.org/2000/svg"` on practically every icon --
		// left unescaped, that substring would survive into the output and
		// get corrupted by such a rewrite, breaking the SVG namespace.
		const svg = '<svg viewBox="0 0 16 16"><path d="M0 0h16v16z" /></svg>';
		const encoded = encodeSvgForCss(svg);
		expect(encoded).not.toContain('http://');
		expect(encoded).not.toContain('https://');
	});
});
