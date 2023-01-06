import { promises as fs } from 'fs';
import type { CustomIconLoader } from '../lib';
import { loadIcon } from '../lib';

const fixturesDir = './tests/fixtures';

const loader: CustomIconLoader = async (name) => {
	return await fs.readFile(`${fixturesDir}/${name}.svg`, 'utf8');
};

describe('Testing loadIcon', () => {
	test('CustomCollection', async () => {
		const svg = await loader('circle');
		expect(svg).toBeTruthy();
		const result = await loadIcon('a', 'circle', {
			customCollections: {
				a: {
					circle: svg as string,
				},
			},
		});
		expect(result).toBeTruthy();
		expect(svg).toEqual(result);
	});

	test('CustomCollection using dynamic import', async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const result = await loadIcon('flat-color-icons', 'up-right', {
			customCollections: {
				'flat-color-icons': () =>
					import(
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						'@iconify-json/flat-color-icons/icons.json'
					).then((i) => i?.default),
			},
		});
		expect(result).toBeTruthy();
	});

	test('CustomCollection with transform', async () => {
		const svg = await loader('circle');
		expect(svg).toBeTruthy();
		const result = await loadIcon('a', 'circle', {
			customCollections: {
				a: {
					circle: svg as string,
				},
			},
			customizations: {
				transform(svg) {
					return svg.replace(
						/<svg\s+/,
						'<svg width="1em" height="1em" '
					);
				},
			},
		});
		expect(result).toBeTruthy();
		expect(result && result.indexOf('width="1em"') > -1).toBeTruthy();
		expect(result && result.indexOf('height="1em"') > -1).toBeTruthy();
	});

	test('CustomCollection Icon with XML heading', async () => {
		const svg = await loader('1f3eb');
		expect(svg).toBeTruthy();
		// Intercept console.warn
		let warned = false;
		const warn = console.warn;
		console.warn = (/*...args*/) => {
			// warn.apply(this, args);
			warned = true;
		};

		const result = await loadIcon('a', '1f3eb', {
			customCollections: {
				a: {
					'1f3eb': svg as string,
				},
			},
		});
		// Restore console.warn
		console.warn = warn;

		expect(svg).not.toEqual(result);
		expect(
			svg?.replace(
				'<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
				''
			)
		).toEqual(result);

		// warning should not longer be used
		expect(warned).toEqual(false);
	});
});
