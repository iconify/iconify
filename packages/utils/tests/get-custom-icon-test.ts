import { promises as fs } from 'fs';
import { getCustomIcon } from '../lib';
import { IconifyLoaderOptions } from '../src';

const fixturesDir = './tests/fixtures';

describe('Testing getCustomIcon', () => {
	test('CustomIconLoader', async () => {
		const svg = await fs.readFile(fixturesDir + '/circle.svg', 'utf8');
		const result = await getCustomIcon(() => svg, 'a', 'b');
		expect(svg).toEqual(result);
	});

	test("CustomIconLoader with transform: scale/width/height shouldn't take effect", async () => {
		const svg = await fs.readFile(fixturesDir + '/circle.svg', 'utf8');
		const options: IconifyLoaderOptions = {
			scale: 2,
			customizations: {
				additionalProps: {
					width: '4em',
					height: '4em',
				},
				transform(icon) {
					return icon.replace(
						'<svg ',
						'<svg width="1em" height="1em" '
					);
				},
			},
			usedProps: {},
		};
		const result = await getCustomIcon(() => svg, 'a', 'b', options);
		expect(result && result.indexOf('width="1em"') > -1).toBeTruthy();
		expect(result && result.indexOf('height="1em"') > -1).toBeTruthy();
		expect(options.usedProps).toHaveProperty('width');
		expect(options.usedProps).toHaveProperty('height');
		expect(options.usedProps.width).toEqual('4em');
		expect(options.usedProps.height).toEqual('4em');
	});

	test('Icon with XML heading', async () => {
		// Intercept console.warn
		let warned = false;
		const warn = console.warn;
		console.warn = (/*...args*/) => {
			// warn.apply(this, args);
			warned = true;
		};

		const svg = await fs.readFile(fixturesDir + '/1f3eb.svg', 'utf8');
		const result = await getCustomIcon(() => svg, 'a', 'b');

		// Restore console.warn
		console.warn = warn;

		expect(svg).toEqual(result);
		expect(warned).toEqual(true);
	});
});
