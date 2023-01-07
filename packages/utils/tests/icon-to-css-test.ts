import { svgToURL } from '../lib/svg/url';
import { getIconCSS } from '../lib/css/icon';
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
  background: no-repeat center / 100%;
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
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="24" height="16">${icon.body}</svg>`
		);

		expect(
			getIconCSS(icon, {
				iconSelector: '.test-icon:after',
				pseudoSelector: true,
				varName: 'svg',
				forceSquare: true,
				format: 'expanded',
			})
		).toBe(`.test-icon:after {
  display: inline-block;
  width: 1em;
  height: 1em;
  content: '';
  background: no-repeat center / 100%;
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
  -webkit-mask: no-repeat center / 100%;
  mask: no-repeat center / 100%;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
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

		expect(
			getIconCSS(icon, {
				format: 'expanded',
				color: 'purple',
			})
		).toBe(`.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  background: no-repeat center / 100%;
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
  -webkit-mask: no-repeat center / 100%;
  mask: no-repeat center / 100%;
  -webkit-mask-image: ${expectedURL};
  mask-image: ${expectedURL};
}
`);
	});
});
