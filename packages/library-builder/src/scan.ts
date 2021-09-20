import { promises as fs } from 'fs';

/**
 * Scan folder
 */
export async function scanFolder(
	rootDir: string,
	fileExtensions: string[] = ['ts'],
	includeExtension: boolean = false
): Promise<string[]> {
	const results: string[] = [];

	async function scan(dir: string) {
		const files = await fs.readdir(rootDir + dir);
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (file.slice(0, 1) === '.') {
				continue;
			}

			const filename = dir + '/' + file;
			const stat = await fs.lstat(rootDir + filename);
			if (stat.isDirectory()) {
				await scan(filename);
				continue;
			}

			const parts = filename.split('.');
			const ext = parts.pop()!;
			if (fileExtensions.indexOf(ext) !== -1) {
				results.push(includeExtension ? filename : parts.join('.'));
			}
		}
	}
	await scan('');

	results.sort((a, b) => a.localeCompare(b));
	return results;
}
