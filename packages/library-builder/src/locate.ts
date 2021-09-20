import fs from 'fs';
import path from 'path';

type TestFileResult = 'file' | 'dir' | null;

export interface LocateImportResult {
	fileWithExt: string;
	file: string;
	ext: string;
}

/**
 * Check if target is a file or directory
 */
function testFile(resolveDir: string, file: string): TestFileResult {
	try {
		const stat = fs.lstatSync(path.resolve(resolveDir, file));
		if (stat.isFile()) {
			return 'file';
		}
		if (stat.isDirectory()) {
			return 'dir';
		}
	} catch (err) {
		//
	}
	return null;
}

/**
 * Split file
 */
export function splitFile(fileWithExt: string): LocateImportResult {
	const parts = fileWithExt.split('.');
	const ext = parts.pop()!;
	const file = parts.join('.');
	return {
		fileWithExt,
		file,
		ext,
	};
}

/**
 * Locate imported file
 */
export function locateImport(
	resolveDir: string,
	importPath: string,
	testExtensions: string[] = ['ts'],
	indexFile: string = 'index'
): LocateImportResult | null {
	if (importPath.slice(0, 1) !== '.') {
		return null;
	}

	// Check if file exists as is
	const mainResult = testFile(resolveDir, importPath);
	if (mainResult === 'file') {
		return splitFile(importPath);
	}

	// Attempt to add extension
	for (let i = 0; i < testExtensions.length; i++) {
		const ext = testExtensions[i];
		const fileWithExt = importPath + '.' + ext;
		if (testFile(resolveDir, fileWithExt) === 'file') {
			return splitFile(fileWithExt);
		}
	}

	// Check directory
	if (mainResult === 'dir') {
		// Test '/index.*'
		for (let i = 0; i < testExtensions.length; i++) {
			const ext = testExtensions[i];
			const testing =
				importPath +
				(importPath.slice(-1) === '/' ? '' : '/') +
				indexFile +
				'.' +
				ext;
			if (testFile(resolveDir, testing) === 'file') {
				return splitFile(testing);
			}
		}
	}

	// Cannot locate file
	return null;
}
