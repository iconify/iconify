import { loadIcon } from '../lib';

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

	test('loadIcon with transform with default style and class', async () => {
		const result = await loadIcon('flat-color-icons', 'up-right', {
			defaultStyle: 'margin-top: 1rem;',
			defaultClass: 'clazz',
			customizations: {
				transform(icon) {
					return icon.replace('<svg ', '<svg width="1em" height="1em" ');
				},
			}
		});
		expect(result).toBeTruthy();
		expect(result && result.indexOf('margin-top: 1rem;') > - 1).toBeTruthy();
		expect(result && result.indexOf('class="clazz"') > - 1).toBeTruthy();
		expect(result && result.indexOf('width="1em"') > - 1).toBeTruthy();
		expect(result && result.indexOf('height="1em"') > - 1).toBeTruthy();
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
});
