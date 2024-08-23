import { svgToURL } from '../lib/svg/url';
import { getIconCSS, getIconContentCSS } from '../lib/css/icon';
import type { IconifyIcon } from '@iconify/types';

describe('Testing CSS for icon', () => {
	test('Background', () => {
		const icon: IconifyIcon = {
			body: '<path d="M0 0h16v16z" fill="#f80" />',
			width: 24,
			height: 16,
		};
		const expectedURL = svgToURL(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="24" height="16">${icon.body}</svg>`
		);

		expect(
			getIconCSS(icon, {
				format: 'expanded',
			})
		).toBe(`.icon {
  display: inline-block;
  width: 1.5em;
  height: 1em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: ${expectedURL};
}
`);
	});

	test('Background with transformations', () => {
		const icon: IconifyIcon = {
			body: '<path d="M0 0h16v16z" fill="#f80" />',
			rotate: 1,
			width: 24,
			height: 16,
		};
		const expectedURL = svgToURL(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 24" width="16" height="24"><g transform="rotate(90 8 8)">${icon.body}</g></svg>`
		);

		expect(
			getIconCSS(icon, {
				format: 'expanded',
			})
		).toBe(`.icon {
  display: inline-block;
  width: 0.67em;
  height: 1em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: ${expectedURL};
}
`);
	});

	test('Background with options', () => {
		const icon: IconifyIcon = {
			body: '<path d="M0 0h16v16z" fill="#f80" />',
			width: 24,
			height: 16,
		};
		const expectedURL = svgToURL(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4 24 24" width="24" height="24">${icon.body.replace(
				'f80',
				'fff'
			)}</svg>`
		);

		expect(
			getIconCSS(icon, {
				iconSelector: '.test-icon:after',
				pseudoSelector: true,
				varName: 'svg',
				forceSquare: true,
				format: 'expanded',
				rules: {
					visibility: 'visible',
				},
				customise: (content) => content.replace('f80', 'fff'),
			})
		).toBe(`.test-icon:after {
  visibility: visible;
  display: inline-block;
  width: 1em;
  height: 1em;
  content: '';
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: ${expectedURL};
}
`);
	});

	test('Mask', () => {
		const icon: IconifyIcon = {
			body: '<path d="M0 0h16v16z" fill="currentColor" stroke="currentColor" stroke-width="1" />',
		};
		const expectedURL = svgToURL(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">${icon.body.replace(
				/currentColor/g,
				'black'
			)}</svg>`
		);

		expect(
			getIconCSS(icon, {
				format: 'expanded',
			})
		).toBe(`.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  --svg: ${expectedURL};
}
`);
	});

	test('Change color', () => {
		const icon: IconifyIcon = {
			body: '<path d="M0 0h16v16z" fill="currentColor" stroke="currentColor" stroke-width="1" />',
		};
		const expectedURL = svgToURL(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">${icon.body.replace(
				/currentColor/g,
				'purple'
			)}</svg>`
		);

		// Use color option
		expect(
			getIconCSS(icon, {
				format: 'expanded',
				color: 'purple',
			})
		).toBe(`.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: ${expectedURL};
}
`);

		// Use customise option
		expect(
			getIconCSS(icon, {
				format: 'expanded',
				customise: (content) =>
					content.replace(/currentColor/g, 'purple'),
			})
		).toBe(`.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: ${expectedURL};
}
`);
	});

	test('Mask with options', () => {
		const icon: IconifyIcon = {
			body: '<path d="M0 0h16v16z" fill="#f00" />',
		};
		const expectedURL = svgToURL(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">${icon.body}</svg>`
		);

		expect(
			getIconCSS(icon, {
				format: 'expanded',
				varName: null,
				mode: 'mask',
			})
		).toBe(`.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-image: ${expectedURL};
  mask-image: ${expectedURL};
}
`);
	});

	test('Content', () => {
		const icon: IconifyIcon = {
			body: '<path d="M0 0h16v16z" fill="#f80" />',
			width: 24,
			height: 16,
		};
		const expectedURL = svgToURL(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="48" height="32">${icon.body}</svg>`
		);

		expect(
			getIconContentCSS(icon, {
				height: 32,
				format: 'expanded',
			})
		).toBe(`.icon::after {
  content: ${expectedURL};
}
`);
	});

	test('Content with options', () => {
		const icon: IconifyIcon = {
			body: '<path d="M0 0h16v16z" fill="currentColor" stroke="currentColor" stroke-width="1" />',
		};
		const expectedURL = svgToURL(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="24">${icon.body.replace(
				/currentColor/g,
				'purple'
			)}</svg>`
		);

		expect(
			getIconContentCSS(icon, {
				width: 32,
				height: 24,
				format: 'expanded',
				color: 'purple',
				iconSelector: '.test-icon::before',
				rules: {
					visibility: 'visible',
				},
			})
		).toBe(`.test-icon::before {
  visibility: visible;
  content: ${expectedURL};
}
`);
	});

	test('Transformations with getIconContentCSS', () => {
		const icon: IconifyIcon = {
			body: '<path d="M0 0h16v16z" fill="currentColor" stroke="currentColor" stroke-width="1" />',
			hFlip: true,
		};
		const expectedURL = svgToURL(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24"><g transform="translate(16 0) scale(-1 1)">${icon.body.replace(
				/currentColor/g,
				'black'
			)}</g></svg>`
		);

		expect(
			getIconContentCSS(icon, {
				height: 24,
				format: 'expanded',
				iconSelector: '.test-icon::before',
			})
		).toBe(`.test-icon::before {
  content: ${expectedURL};
}
`);
	});
});
