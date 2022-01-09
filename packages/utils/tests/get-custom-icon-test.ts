import { getCustomIcon } from '../lib';

const svg =
	'<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="50"/></svg>';

describe('Testing getCustomIcon', () => {
	test('CustomIconLoader', async () => {
		const result = await getCustomIcon(() => svg, 'a', 'b');
		expect(svg).toEqual(result);
	});

	test('CustomIconLoader with transform', async () => {
		const result = await getCustomIcon(
			() => svg,
			'a',
			'b',
			(icon) => {
				return icon.replace('<svg ', '<svg width="1em" height="1em" ');
			}
		);
		expect(result && result.indexOf('width="1em"') > -1).toBeTruthy();
		expect(result && result.indexOf('height="1em"') > -1).toBeTruthy();
	});
});
