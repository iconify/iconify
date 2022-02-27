import { loadIcon } from '../lib/loader/loader';

describe('Testing loadIcon with @iconify-json/flat-color-icons>', () => {

	test('loadIcon works', async () => {
		const result = await loadIcon('flat-color-icons', 'up-right');
		expect(result).toBeTruthy();
	});

	test('loadIcon adds xmlns:xlink', async () => {
		const result = await loadIcon('flat-color-icons', 'up-right', { addXmlNs: true });
		expect(result).toBeTruthy();
		expect(result && result.indexOf('xmlns:xlink=') > - 1).toBeTruthy();
	});

	test('loadIcon with customize with default style and class', async () => {
		const result = await loadIcon('flat-color-icons', 'up-right', {
			defaultStyle: 'margin-top: 1rem;',
			defaultClass: 'clazz',
			customizations: {
				customize(props) {
					props.width = '2em';
					props.height = '2em';
					return props;
				},
			}
		});
		expect(result).toBeTruthy();
		expect(result && result.indexOf('margin-top: 1rem;') > - 1).toBeTruthy();
		expect(result && result.indexOf('class="clazz"') > - 1).toBeTruthy();
		expect(result && result.indexOf('width="2em"') > - 1).toBeTruthy();
		expect(result && result.indexOf('height="2em"') > - 1).toBeTruthy();
	});

	test('loadIcon preserves customizations order', async () => {
		const result = await loadIcon('flat-color-icons', 'up-right', {
			scale: 1,
			defaultStyle: 'color: red;',
			defaultClass: 'clazz1',
			customizations: {
				additionalProps: {
					'width': '2em',
					'height': '2em',
					'style': 'color: blue;',
					'class': 'clazz2',
				},
				// it will never be called, it is not a custom icon
				transform(icon) {
					return icon.replace('<svg ', '<svg width="4em" height="4em" ');
				},
			}
		});
		expect(result).toBeTruthy();
		expect(result && result.includes('style="color: blue;"')).toBeTruthy();
		expect(result && result.includes('class="clazz2"')).toBeTruthy();
		expect(result && result.includes('width="2em"')).toBeTruthy();
		expect(result && result.includes('height="2em"')).toBeTruthy();
	});

	test('loadIcon warn missing icon', async () => {
		// Intercept console.warn
		let warned = false;
		const warn = console.warn;
		console.warn = (/*...args*/) => {
			// warn.apply(this, args);
			warned = true;
		};

		const result = await loadIcon('flat-color-icons', 'missing1', {
			warn: 'flat-color-icons:missing'
		});
		// Restore console.warn
		console.warn = warn;

		expect(result).toBeFalsy();
		expect(warned).toEqual(true);
	});

	test('test warnOnce on loadIcon on missing icon', async () => {
		// Intercept console.warn
		let warned = false;
		const warn = console.warn;
		console.warn = (/*...args*/) => {
			// warn.apply(this, args);
			warned = true;
		};

		// use another name since it is using warnOnce
		const result = await loadIcon('flat-color-icons', 'missing1', {
			warn: 'flat-color-icons:missing'
		});
		// Restore console.warn
		console.warn = warn;

		expect(result).toBeFalsy();
		expect(warned).toEqual(false);
	});

	test('loadIcon doesn\'t warn missing icon', async () => {
		// Intercept console.warn
		let warned = false;
		const warn = console.warn;
		console.warn = (/*...args*/) => {
			// warn.apply(this, args);
			warned = true;
		};

		// use another name since it is using warnOnce
		const result = await loadIcon('flat-color-icons', 'missing2');
		// Restore console.warn
		console.warn = warn;

		expect(result).toBeFalsy();
		expect(warned).toEqual(false);
	});
});
