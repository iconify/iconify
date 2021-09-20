import { locateImport } from '../lib/locate';

const fixturesDir = __dirname + '/fixtures';

describe('Testing locateImport', () => {
	test('with extension', () => {
		// Relative to fixture directory
		expect(locateImport(fixturesDir, './imports/index.ts')).toEqual({
			ext: 'ts',
			file: './imports/index',
			fileWithExt: './imports/index.ts',
		});

		// Relative to imports directory
		expect(locateImport(fixturesDir + '/imports', './index.ts')).toEqual({
			ext: 'ts',
			file: './index',
			fileWithExt: './index.ts',
		});

		// Parent directory
		expect(
			locateImport(fixturesDir + '/imports/test', '../test/bar.ts')
		).toEqual({
			ext: 'ts',
			file: '../test/bar',
			fileWithExt: '../test/bar.ts',
		});
	});

	test('without extension', () => {
		// Relative to fixture directory
		expect(locateImport(fixturesDir, './imports/test/bar')).toEqual({
			ext: 'ts',
			file: './imports/test/bar',
			fileWithExt: './imports/test/bar.ts',
		});

		// Matching directory and file: file should be selected, like in require()
		expect(locateImport(fixturesDir, './imports/test')).toEqual({
			ext: 'ts',
			file: './imports/test',
			fileWithExt: './imports/test.ts',
		});

		// Invalid file: only .js file exists
		expect(
			locateImport(fixturesDir + '/imports/test', './foo/compiled')
		).toBeNull();

		expect(
			locateImport(fixturesDir + '/imports/test', './foo/compiled', [
				'ts',
			])
		).toBeNull();

		// Custom extension
		expect(
			locateImport(fixturesDir + '/imports/test', './foo/compiled', [
				'js',
			])
		).toEqual({
			ext: 'js',
			file: './foo/compiled',
			fileWithExt: './foo/compiled.js',
		});
	});
});
