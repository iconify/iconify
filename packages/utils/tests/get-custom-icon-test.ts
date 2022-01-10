import { promises as fs } from 'fs';
import { getCustomIcon } from '../lib';

const fixturesDir = __dirname + '/fixtures';

describe('Testing getCustomIcon', () => {
	test('CustomIconLoader', async () => {
		const svg = await fs.readFile(fixturesDir + '/circle.svg', 'utf8');
		const result = await getCustomIcon(() => svg, 'a', 'b');
		expect(svg).toEqual(result);
	});

	test('CustomIconLoader with transform', async () => {
		const svg = await fs.readFile(fixturesDir + '/circle.svg', 'utf8');
		const result = await getCustomIcon(
			() => svg,
			'a',
			'b',
			{
				transform(icon) {
					return icon.replace('<svg ', '<svg width="1em" height="1em" ');
				}
			}

		);
		expect(result && result.indexOf('width="1em"') > -1).toBeTruthy();
		expect(result && result.indexOf('height="1em"') > -1).toBeTruthy();
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
