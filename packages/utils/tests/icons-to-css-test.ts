import { svgToURL } from '../lib/svg/url';
import { getIconsCSS, getIconsContentCSS } from '../lib/css/icons';
import type { IconifyJSON } from '@iconify/types';

describe('Testing CSS for multiple icons', () => {
	test('Monotone icons', () => {
		const iconSet: IconifyJSON = {
			prefix: 'test-prefix',
			icons: {
				'123': {
					body: '<path fill="currentColor" d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169c.676 0 1.174.44 1.174 1.106c0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179c.01.707-.55 1.216-1.421 1.21c-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918c1.478 0 2.642-.839 2.62-2.144c-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678c-.026-1.053-.933-1.855-2.359-1.845c-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944c.703 0 1.206.435 1.206 1.07c.005.64-.504 1.106-1.2 1.106h-.75v.96Z"/>',
				},
				'activity': {
					body: '<path fill="currentColor" fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964L4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>',
				},
				'airplane': {
					body: '<path fill="currentColor" d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918l-.375 2.253l1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318l-.376-2.253l-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Zm.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1c-.213 0-.458.158-.678.599Z"/>',
				},
				'airplane_engines': {
					body: '<path fill="currentColor" d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272l.313.937a.5.5 0 0 0 .948 0l.405-1.214l2.21-.369l.375 2.253l-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318l.375-2.253l2.21.369l.405 1.214a.5.5 0 0 0 .948 0l.313-.937l1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0ZM7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1c.213 0 .458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7V3Z"/>',
				},
				'empty': {
					body: '<g />',
				},
			},
		};
		const expectedURL = (name: string, color = 'black') =>
			svgToURL(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">${iconSet.icons[
					name
				].body.replace(/currentColor/g, color)}</svg>`
			);

		// Detect mode: mask
		expect(
			getIconsCSS(
				iconSet,
				['activity', '123', 'airplane_engines', 'missing'],
				{
					format: 'expanded',
					rules: {
						visibility: 'visible',
					},
				}
			)
		).toBe(`.icon--test-prefix {
  visibility: visible;
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
}

.icon--test-prefix--activity {
  --svg: ${expectedURL('activity')};
}

.icon--test-prefix--123 {
  --svg: ${expectedURL('123')};
}

.icon--test-prefix--airplane_engines {
  --svg: ${expectedURL('airplane_engines')};
}

/* Could not find icon: missing */
`);

		// Force mode: background
		expect(
			getIconsCSS(iconSet, ['123'], {
				format: 'expanded',
				mode: 'background',
				// Swap content
				customise: (content, name) =>
					name === '123' ? iconSet.icons['airplane'].body : content,
			})
		).toBe(`.icon--test-prefix {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.icon--test-prefix--123 {
  background-image: ${expectedURL('airplane')};
}
`);

		// Force background by setting color
		expect(
			getIconsCSS(iconSet, ['empty'], {
				format: 'expanded',
				color: 'red',
			})
		).toBe(`.icon--test-prefix {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.icon--test-prefix--empty {
  background-image: ${expectedURL('empty', 'red')};
}
`);

		expect(
			getIconsCSS(iconSet, ['activity'], {
				format: 'expanded',
				customise: (content) => content.replace(/currentColor/g, 'red'),
			})
		).toBe(`.icon--test-prefix {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.icon--test-prefix--activity {
  background-image: ${expectedURL('activity', 'red')};
}
`);
	});

	test('Mask', () => {
		const iconSet: IconifyJSON = {
			prefix: 'bi',
			info: {
				name: 'Bootstrap Icons',
				total: 1953,
				version: '1.10.2',
				author: {
					name: 'The Bootstrap Authors',
					url: 'https://github.com/twbs/icons',
				},
				license: {
					title: 'MIT',
					spdx: 'MIT',
					url: 'https://github.com/twbs/icons/blob/main/LICENSE.md',
				},
				samples: ['graph-up', 'card-image', 'code-slash'],
				height: 16,
				category: 'General',
				palette: false,
			},
			icons: {
				'123': {
					body: '<path fill="currentColor" d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169c.676 0 1.174.44 1.174 1.106c0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179c.01.707-.55 1.216-1.421 1.21c-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918c1.478 0 2.642-.839 2.62-2.144c-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678c-.026-1.053-.933-1.855-2.359-1.845c-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944c.703 0 1.206.435 1.206 1.07c.005.64-.504 1.106-1.2 1.106h-.75v.96Z"/>',
				},
				'activity': {
					body: '<path fill="currentColor" fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964L4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>',
				},
				'airplane': {
					body: '<path fill="currentColor" d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918l-.375 2.253l1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318l-.376-2.253l-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Zm.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1c-.213 0-.458.158-.678.599Z"/>',
				},
				'airplane-engines': {
					body: '<path fill="currentColor" d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272l.313.937a.5.5 0 0 0 .948 0l.405-1.214l2.21-.369l.375 2.253l-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318l.375-2.253l2.21.369l.405 1.214a.5.5 0 0 0 .948 0l.313-.937l1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0ZM7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1c.213 0 .458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7V3Z"/>',
				},
			},
		};
		const expectedURL = (name: string, color = 'black') =>
			svgToURL(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">${iconSet.icons[
					name
				].body.replace(/currentColor/g, color)}</svg>`
			);

		expect(
			getIconsCSS(iconSet, ['activity', 'airplane-engines'], {
				format: 'expanded',
			})
		).toBe(`.icon--bi {
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
}

.icon--bi--activity {
  --svg: ${expectedURL('activity')};
}

.icon--bi--airplane-engines {
  --svg: ${expectedURL('airplane-engines')};
}
`);
	});

	test('Mask with custom config', () => {
		const iconSet: IconifyJSON = {
			prefix: 'bi',
			info: {
				name: 'Bootstrap Icons',
				total: 1953,
				version: '1.10.2',
				author: {
					name: 'The Bootstrap Authors',
					url: 'https://github.com/twbs/icons',
				},
				license: {
					title: 'MIT',
					spdx: 'MIT',
					url: 'https://github.com/twbs/icons/blob/main/LICENSE.md',
				},
				samples: ['graph-up', 'card-image', 'code-slash'],
				height: 16,
				category: 'General',
				palette: false,
			},
			icons: {
				'123': {
					body: '<path fill="currentColor" d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169c.676 0 1.174.44 1.174 1.106c0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179c.01.707-.55 1.216-1.421 1.21c-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918c1.478 0 2.642-.839 2.62-2.144c-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678c-.026-1.053-.933-1.855-2.359-1.845c-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944c.703 0 1.206.435 1.206 1.07c.005.64-.504 1.106-1.2 1.106h-.75v.96Z"/>',
				},
				'activity': {
					body: '<path fill="currentColor" fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964L4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>',
				},
				'airplane': {
					body: '<path fill="currentColor" d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918l-.375 2.253l1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318l-.376-2.253l-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Zm.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1c-.213 0-.458.158-.678.599Z"/>',
				},
				'airplane-engines': {
					body: '<path fill="currentColor" d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272l.313.937a.5.5 0 0 0 .948 0l.405-1.214l2.21-.369l.375 2.253l-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318l.375-2.253l2.21.369l.405 1.214a.5.5 0 0 0 .948 0l.313-.937l1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0ZM7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1c.213 0 .458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7V3Z"/>',
				},
			},
			width: 24,
		};
		const expectedURL = (name: string, color = 'black') =>
			svgToURL(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="24" height="16">${iconSet.icons[
					name
				].body.replace(/currentColor/g, color)}</svg>`
			);

		expect(
			getIconsCSS(iconSet, ['activity', 'airplane-engines'], {
				format: 'expanded',
				varName: null,
				rules: {
					visibility: 'visible',
				},
			})
		).toBe(`.icon--bi {
  visibility: visible;
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.icon--bi.icon--bi--activity {
  width: 1.5em;
  -webkit-mask-image: ${expectedURL('activity')};
  mask-image: ${expectedURL('activity')};
}

.icon--bi.icon--bi--airplane-engines {
  width: 1.5em;
  -webkit-mask-image: ${expectedURL('airplane-engines')};
  mask-image: ${expectedURL('airplane-engines')};
}
`);
	});

	test('Mask with custom selector', () => {
		const iconSet: IconifyJSON = {
			prefix: 'bi',
			info: {
				name: 'Bootstrap Icons',
				total: 1953,
				version: '1.10.2',
				author: {
					name: 'The Bootstrap Authors',
					url: 'https://github.com/twbs/icons',
				},
				license: {
					title: 'MIT',
					spdx: 'MIT',
					url: 'https://github.com/twbs/icons/blob/main/LICENSE.md',
				},
				samples: ['graph-up', 'card-image', 'code-slash'],
				height: 16,
				category: 'General',
				palette: false,
			},
			icons: {
				'123': {
					body: '<path fill="currentColor" d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169c.676 0 1.174.44 1.174 1.106c0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179c.01.707-.55 1.216-1.421 1.21c-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918c1.478 0 2.642-.839 2.62-2.144c-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678c-.026-1.053-.933-1.855-2.359-1.845c-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944c.703 0 1.206.435 1.206 1.07c.005.64-.504 1.106-1.2 1.106h-.75v.96Z"/>',
				},
				'activity': {
					body: '<path fill="currentColor" fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964L4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>',
				},
				'airplane': {
					body: '<path fill="currentColor" d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918l-.375 2.253l1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318l-.376-2.253l-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Zm.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1c-.213 0-.458.158-.678.599Z"/>',
				},
				'airplane-engines': {
					body: '<path fill="currentColor" d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272l.313.937a.5.5 0 0 0 .948 0l.405-1.214l2.21-.369l.375 2.253l-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318l.375-2.253l2.21.369l.405 1.214a.5.5 0 0 0 .948 0l.313-.937l1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0ZM7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1c.213 0 .458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7V3Z"/>',
				},
			},
			width: 24,
		};
		const expectedURL = (name: string, color = 'black') =>
			svgToURL(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="24" height="16">${iconSet.icons[
					name
				].body.replace(/currentColor/g, color)}</svg>`
			);

		expect(
			getIconsCSS(iconSet, ['activity', 'airplane-engines'], {
				format: 'expanded',
				iconSelector: '.test--{name}',
				rules: {
					visibility: 'visible',
				},
			})
		).toBe(`.test--activity, .test--airplane-engines {
  visibility: visible;
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
}

.test--activity {
  width: 1.5em;
  --svg: ${expectedURL('activity')};
}

.test--airplane-engines {
  width: 1.5em;
  --svg: ${expectedURL('airplane-engines')};
}
`);
	});

	test('Duplicate selectors', () => {
		const iconSet: IconifyJSON = {
			prefix: 'bi',
			info: {
				name: 'Bootstrap Icons',
				total: 1953,
				version: '1.10.2',
				author: {
					name: 'The Bootstrap Authors',
					url: 'https://github.com/twbs/icons',
				},
				license: {
					title: 'MIT',
					spdx: 'MIT',
					url: 'https://github.com/twbs/icons/blob/main/LICENSE.md',
				},
				samples: ['graph-up', 'card-image', 'code-slash'],
				height: 16,
				category: 'General',
				palette: false,
			},
			icons: {
				'123': {
					body: '<path fill="currentColor" d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169c.676 0 1.174.44 1.174 1.106c0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179c.01.707-.55 1.216-1.421 1.21c-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918c1.478 0 2.642-.839 2.62-2.144c-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678c-.026-1.053-.933-1.855-2.359-1.845c-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944c.703 0 1.206.435 1.206 1.07c.005.64-.504 1.106-1.2 1.106h-.75v.96Z"/>',
				},
				'activity': {
					body: '<path fill="currentColor" fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964L4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>',
				},
				'airplane': {
					body: '<path fill="currentColor" d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918l-.375 2.253l1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318l-.376-2.253l-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Zm.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1c-.213 0-.458.158-.678.599Z"/>',
				},
				'airplane-engines': {
					body: '<path fill="currentColor" d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272l.313.937a.5.5 0 0 0 .948 0l.405-1.214l2.21-.369l.375 2.253l-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318l.375-2.253l2.21.369l.405 1.214a.5.5 0 0 0 .948 0l.313-.937l1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0ZM7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1c.213 0 .458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7V3Z"/>',
				},
			},
			width: 24,
		};
		const expectedURL = (name: string, color = 'black') =>
			svgToURL(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="24" height="16">${iconSet.icons[
					name
				].body.replace(/currentColor/g, color)}</svg>`
			);

		expect(
			getIconsCSS(iconSet, ['activity'], {
				format: 'expanded',
				iconSelector: '.test--{name}',
			})
		).toBe(`.test--activity {
  display: inline-block;
  width: 1.5em;
  height: 1em;
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  --svg: ${expectedURL('activity')};
}
`);
	});

	test('Content', () => {
		const iconSet: IconifyJSON = {
			prefix: 'test-prefix',
			icons: {
				'123': {
					body: '<path fill="currentColor" d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169c.676 0 1.174.44 1.174 1.106c0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179c.01.707-.55 1.216-1.421 1.21c-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918c1.478 0 2.642-.839 2.62-2.144c-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678c-.026-1.053-.933-1.855-2.359-1.845c-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944c.703 0 1.206.435 1.206 1.07c.005.64-.504 1.106-1.2 1.106h-.75v.96Z"/>',
				},
				'activity': {
					body: '<path fill="currentColor" fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964L4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>',
				},
				'airplane': {
					body: '<path fill="currentColor" d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918l-.375 2.253l1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318l-.376-2.253l-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Zm.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1c-.213 0-.458.158-.678.599Z"/>',
				},
				'airplane-engines': {
					body: '<path fill="currentColor" d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272l.313.937a.5.5 0 0 0 .948 0l.405-1.214l2.21-.369l.375 2.253l-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318l.375-2.253l2.21.369l.405 1.214a.5.5 0 0 0 .948 0l.313-.937l1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0ZM7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1c.213 0 .458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7V3Z"/>',
				},
				'empty': {
					body: '<g />',
				},
			},
		};
		const expectedURL = (name: string, color = 'black') =>
			svgToURL(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">${iconSet.icons[
					name
				].body.replace(/currentColor/g, color)}</svg>`
			);

		expect(
			getIconsContentCSS(
				iconSet,
				['activity', '123', 'airplane', 'whatever'],
				{
					height: 16,
					format: 'expanded',
					rules: {
						display: 'inline-block',
					},
				}
			)
		).toBe(`.icon--test-prefix--activity::after {
  display: inline-block;
  content: ${expectedURL('activity')};
}

.icon--test-prefix--123::after {
  display: inline-block;
  content: ${expectedURL('123')};
}

.icon--test-prefix--airplane::after {
  display: inline-block;
  content: ${expectedURL('airplane')};
}

/* Could not find icon: whatever */
`);
	});
});
