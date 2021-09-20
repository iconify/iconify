import { scanFolder } from '../lib/scan';

const fixturesDir = __dirname + '/fixtures';

describe('Testing scanFolder', () => {
	test('scanning fixtures', async () => {
		// Default params
		expect(await scanFolder(fixturesDir)).toEqual([
			'/imports/dummy',
			'/imports/index',
			'/imports/test',
			'/imports/test/bar',
			'/imports/test/foo/index',
			'/imports/test/test',
			'/imports/test2/index',
		]);

		// Include extensions
		expect(await scanFolder(fixturesDir, ['ts'], true)).toEqual([
			'/imports/dummy.ts',
			'/imports/index.ts',
			'/imports/test.ts',
			'/imports/test/bar.ts',
			'/imports/test/foo/index.ts',
			'/imports/test/test.ts',
			'/imports/test2/index.ts',
		]);

		// Find .js files
		expect(await scanFolder(fixturesDir, ['js'])).toEqual([
			'/imports/test/foo/compiled',
		]);
	});
});
