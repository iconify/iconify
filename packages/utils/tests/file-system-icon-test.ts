import { FileSystemIconLoader } from '../lib/loader/node-loaders';

const fixturesDir = './tests/fixtures';

describe('Testing FileSystemIconLoader', () => {
	test('FileSystemIconLoader', async () => {
		const result = await FileSystemIconLoader(fixturesDir)('circle');
		expect(result && result.indexOf('svg') > -1).toBeTruthy();
	});

	test('FileSystemIconLoader with transform', async () => {
		const result = await FileSystemIconLoader(fixturesDir, (icon) => {
			return icon.replace('<svg ', '<svg width="1em" height="1em" ');
		})('circle');
		expect(result && result.indexOf('width="1em"') > -1).toBeTruthy();
		expect(result && result.indexOf('height="1em"') > -1).toBeTruthy();
	});
});
