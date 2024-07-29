import { promises as fs } from 'fs';
import { getCustomIcon } from '../lib/loader/custom';
import type { IconifyLoaderOptions } from '../lib/loader/types';

const fixturesDir = './tests/fixtures';

describe('Testing getCustomIcon', () => {
	test('CustomIconLoader', async () => {
		const svg = await fs.readFile(fixturesDir + '/circle.svg', 'utf8');
		const result = await getCustomIcon(() => svg, 'a', 'b');
		expect(svg).toEqual(result);
	});

	test('CustomIconLoader without xmlns', async () => {
		const svg =
			'<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/></svg>';
		const result = await getCustomIcon(() => svg, 'a', 'b', {
			addXmlNs: true,
		});
		expect(result).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/></svg>'
		);
	});

	test('CustomIconLoader should apply trim', async () => {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
<circle cx="60" cy="60" r="50"/>
</svg>
`;
		const result = await getCustomIcon(() => svg, 'a', 'b', {
			customizations: { trimCustomSvg: true },
		});
		expect(result).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/></svg>'
		);
	});

	test('CustomIconLoader cleanups svg preface', async () => {
		const svg = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
<circle cx="60" cy="60" r="50"/>
</svg>
`;
		const result = await getCustomIcon(() => svg, 'a', 'b', {
			customizations: { trimCustomSvg: true },
		});
		expect(result).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/></svg>'
		);
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
				transform(svg) {
					return svg.replace(
						/<svg\s+/,
						'<svg width="1em" height="1em" '
					);
				},
			},
			usedProps: {},
		};
		const result = await getCustomIcon(() => svg, 'a', 'b', options);
		expect(result && result.indexOf('width="1em"') > -1).toBeTruthy();
		expect(result && result.indexOf('height="1em"') > -1).toBeTruthy();

		expect(options.usedProps).toBeTruthy();

		const usedProps = options.usedProps as Record<string, string>;
		expect(usedProps).toHaveProperty('width');
		expect(usedProps).toHaveProperty('height');
		expect(usedProps.width).toEqual('4em');
		expect(usedProps.height).toEqual('4em');
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

		expect(result).toEqual(
			svg.replace(
				'<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
				''
			)
		);
		expect(warned).toEqual(false);
	});

	test('Scale custom icon', async () => {
		const svg =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"/></svg>';

		const options: IconifyLoaderOptions = {
			scale: 2,
		};
		const result = await getCustomIcon(() => svg, 'a', 'b', options);
		expect(result && result.indexOf(' width="2em"') > -1).toBeTruthy();
		expect(result && result.indexOf(' height="2em"') > -1).toBeTruthy();
	});

	test('Scale custom icon with stroke-width', async () => {
		const svg = `<?xml version="1.0" standalone="no"?>
		<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
		  stroke="currentColor">
		  <path d="M12 14V20M10 12L4 10M14 12L20 10M21 12a9 9 0 11-18 0 9 9 0 0118 0zM14 12a2 2 0 11-4 0 2 2 0 014 0z" />
		</svg>`;

		const options: IconifyLoaderOptions = {
			scale: 1.2,
		};
		const result = await getCustomIcon(() => svg, 'a', 'b', options);
		expect(result && result.indexOf(' width="1.2em"') > -1).toBeTruthy();
		expect(result && result.indexOf(' height="1.2em"') > -1).toBeTruthy();
	});

	test('Disable scale for custom icon', async () => {
		const svg =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"/></svg>';

		const options: IconifyLoaderOptions = {
			scale: 0,
		};
		const result = await getCustomIcon(() => svg, 'a', 'b', options);
		expect(result && result.indexOf(' width="') === -1).toBeTruthy();
		expect(result && result.indexOf(' height="') === -1).toBeTruthy();
	});

	test('CustomIconLoader with non-square icon', async () => {
		const svg =
			'<svg viewBox="0 0 90 120"><circle cx="45" cy="60" r="30"/></svg>';
		const result = await getCustomIcon(() => svg, 'a', 'b', {
			addXmlNs: true,
		});
		expect(result).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 120"><circle cx="45" cy="60" r="30"/></svg>'
		);
	});
});
