import type { IconifyIconBuildResult } from '../lib/svg/build';
import { iconToSVG } from '../lib/svg/build';
import type { IconifyIcon } from '../lib/icon/defaults';
import type { IconifyIconCustomisations } from '../lib/customisations/defaults';
import { iconToHTML } from '../lib/svg/html';

describe('Testing iconToSVG', () => {
	test('Empty icon', () => {
		const icon: IconifyIcon = { body: '' };
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '1em',
				height: '1em',
				viewBox: '0 0 16 16',
			},
			viewBox: [0, 0, 16, 16],
			body: '',
		};

		const result = iconToSVG(icon);
		expect(result).toEqual(expected);

		// Test HTML
		const html = iconToHTML(result.body, result.attributes);
		expect(html).toBe(
			'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"></svg>'
		);
	});

	test('Auto size, body', () => {
		const custom: IconifyIconCustomisations = {
			height: 'auto',
		};
		const icon: IconifyIcon = {
			body: '<path d="" />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '16',
				height: '16',
				viewBox: '0 0 16 16',
			},
			viewBox: [0, 0, 16, 16],
			body: '<path d="" />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);

		// Test HTML
		const htmlProps: Record<string, string> = {
			'aria-hidden': 'true',
			'role': 'img',
			...result.attributes,
		};
		const html = iconToHTML(result.body, htmlProps);
		expect(html).toBe(
			'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 16 16"><path d="" /></svg>'
		);
	});

	test('Auto size, body', () => {
		const custom: IconifyIconCustomisations = {
			height: 'auto',
		};
		const icon: IconifyIcon = {
			body: '<path d="" />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '16',
				height: '16',
				viewBox: '0 0 16 16',
			},
			viewBox: [0, 0, 16, 16],
			body: '<path d="" />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Custom size', () => {
		const custom: IconifyIconCustomisations = {
			height: 'auto',
		};
		const icon: IconifyIcon = {
			width: 20,
			height: 16,
			body: '<path d="..." />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '20',
				height: '16',
				viewBox: '0 0 20 16',
			},
			viewBox: [0, 0, 20, 16],
			body: '<path d="..." />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Unset height', () => {
		const custom: IconifyIconCustomisations = {
			// Testing 'unset' keyword
			height: 'unset',
			width: 'auto',
		};
		const icon: IconifyIcon = {
			width: 20,
			height: 16,
			body: '<path d="..." />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '20',
				viewBox: '0 0 20 16',
			},
			viewBox: [0, 0, 20, 16],
			body: '<path d="..." />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Unset size', () => {
		const custom: IconifyIconCustomisations = {
			// Testing 'undefined' and 'none' keywords
			width: 'undefined',
			height: 'none',
		};
		const icon: IconifyIcon = {
			width: 20,
			height: 16,
			body: '<path d="..." />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				viewBox: '0 0 20 16',
			},
			viewBox: [0, 0, 20, 16],
			body: '<path d="..." />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Rotation', () => {
		const custom: IconifyIconCustomisations = {
			height: '40px',
			rotate: 1,
		};
		const icon: IconifyIcon = {
			width: 20,
			height: 16,
			body: '<path d="..." />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '32px',
				height: '40px',
				viewBox: '0 0 16 20',
			},
			viewBox: [0, 0, 16, 20],
			body: '<g transform="rotate(90 8 8)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Negative rotation', () => {
		const custom: IconifyIconCustomisations = {
			height: '40px',
			rotate: -1,
		};
		const icon: IconifyIcon = {
			width: 20,
			height: 16,
			body: '<path d="..." />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '32px',
				height: '40px',
				viewBox: '0 0 16 20',
			},
			viewBox: [0, 0, 16, 20],
			body: '<g transform="rotate(-90 10 10)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Flip', () => {
		const custom: IconifyIconCustomisations = {
			height: '32',
			hFlip: true,
		};
		const icon: IconifyIcon = {
			width: 20,
			height: 16,
			body: '<path d="..." />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '40',
				height: '32',
				viewBox: '0 0 20 16',
			},
			viewBox: [0, 0, 20, 16],
			body: '<g transform="translate(20 0) scale(-1 1)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Flip, rotation', () => {
		const custom: IconifyIconCustomisations = {
			hFlip: true,
			rotate: 1,
		};
		const icon: IconifyIcon = {
			width: 20,
			height: 16,
			body: '<path d="..." />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '0.8em',
				height: '1em',
				viewBox: '0 0 16 20',
			},
			viewBox: [0, 0, 16, 20],
			body: '<g transform="rotate(90 8 8) translate(20 0) scale(-1 1)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Flip icon that is rotated by default', () => {
		const custom: IconifyIconCustomisations = {
			hFlip: true,
		};
		const icon: IconifyIcon = {
			width: 20,
			height: 16,
			body: '<path d="..." />',
			rotate: 1,
		};

		// Horizontally flipping icon that has 90 or 270 degrees rotation will result in vertical flip.
		// Therefore result should be rotation + vertical flip to visually match horizontal flip on normal icon.
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '0.8em',
				height: '1em',
				viewBox: '0 0 16 20',
			},
			viewBox: [0, 0, 16, 20],
			body: '<g transform="translate(16 0) scale(-1 1)"><g transform="rotate(90 8 8)"><path d="..." /></g></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Flip and rotation canceling eachother', () => {
		const custom: IconifyIconCustomisations = {
			width: '1em',
			height: 'auto',
			hFlip: true,
			vFlip: true,
			rotate: 2,
		};
		const icon: IconifyIcon = {
			width: 20,
			height: 16,
			body: '<path d="..." />',
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '1em',
				height: '16',
				viewBox: '0 0 20 16',
			},
			viewBox: [0, 0, 20, 16],
			body: '<path d="..." />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).toEqual(expected);
	});

	test('Flip with icon, no customisations', () => {
		const iconBody =
			'<g stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" fill-rule="evenodd"><path d="M40 64l48-48" class="animation-delay-0 animation-duration-10 animate-stroke stroke-length-102"/><path d="M40 64l48 48" class="animation-delay-0 animation-duration-10 animate-stroke stroke-length-102"/></g>';

		const icon: IconifyIcon = {
			body: iconBody,
			width: 128,
			height: 128,
			hFlip: true,
		};
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '1em',
				height: '1em',
				viewBox: '0 0 128 128',
			},
			viewBox: [0, 0, 128, 128],
			body:
				'<g transform="translate(128 0) scale(-1 1)">' +
				iconBody +
				'</g>',
		};

		const result = iconToSVG(icon);
		expect(result).toEqual(expected);
	});
});
