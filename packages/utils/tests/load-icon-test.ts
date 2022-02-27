import { promises as fs } from 'fs';
import type { CustomIconLoader } from '../lib';
import { loadIcon } from '../lib/loader/loader';

const fixturesDir = __dirname + '/fixtures';

const loader: CustomIconLoader = async(name) => {
	return await fs.readFile(`${fixturesDir}/${name}.svg`, 'utf8');
}

describe('Testing loadIcon', () => {
	test('CustomCollection', async () => {
		const svg = await loader('circle');
		expect(svg).toBeTruthy();
		const result = await loadIcon('a', 'circle', {
			customCollections: {
				'a': {
					'circle': svg as string,
				},
			},
		});
		expect(result).toBeTruthy();
		expect(svg).toEqual(result);
	});

	test('CustomCollection using dynamic import', async () => {
		const result = await loadIcon('flat-color-icons', 'up-right', {
			customCollections: {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				'flat-color-icons': () => import('@iconify-json/flat-color-icons/icons.json').then(i => i?.default),
			},
		});
		expect(result).toBeTruthy();
	});

	test('CustomCollection with transform', async () => {
		const svg = await loader('circle');
		expect(svg).toBeTruthy();
		const result = await loadIcon('a', 'circle', {
			customCollections: {
				'a': {
					'circle': svg as string,
				},
			},
			customizations: {
				transform(icon) {
					return icon.replace('<svg ', '<svg width="1em" height="1em" ');
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
				'a': {
					'1f3eb': svg as string,
				},
			},
		});
		// Restore console.warn
		console.warn = warn;

		expect(svg).toEqual(result);
		expect(warned).toEqual(true);
	});
});
