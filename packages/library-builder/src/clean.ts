import { promises as fs } from 'fs';

/**
 * Clean up directory
 */
export async function cleanDir(dir: string) {
	let files: string[];
	try {
		files = await fs.readdir(dir);
	} catch (err) {
		return;
	}

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const filename = dir + '/' + file;
		let stat;
		try {
			stat = await fs.lstat(filename);
		} catch (err) {
			continue;
		}

		if (stat.isDirectory()) {
			await cleanDir(filename);
			try {
				await fs.rmdir(filename);
			} catch (err) {
				//
			}
			continue;
		}

		try {
			await fs.unlink(filename);
		} catch (err) {
			//
		}
	}
}
