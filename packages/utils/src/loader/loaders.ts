import type { Awaitable } from '@antfu/utils';
import { promises as fs, Stats } from 'fs';
import type { CustomIconLoader } from './types';
import { camelize, pascalize } from '../misc/strings';

/**
 * Returns CustomIconLoader for loading icons from a directory
 */
export function FileSystemIconLoader(
	dir: string,
	transform?: (svg: string) => Awaitable<string>
): CustomIconLoader {
	return async (name) => {
		const paths = [
			`${dir}/${name}.svg`,
			`${dir}/${camelize(name)}.svg`,
			`${dir}/${pascalize(name)}.svg`,
		];
		for (const path of paths) {
			let stat: Stats;
			try {
				stat = await fs.lstat(path);
			} catch (err) {
				continue;
			}
			if (stat.isFile()) {
				const svg = await fs.readFile(path, 'utf-8');
				return typeof transform === 'function'
					? await transform(svg)
					: svg;
			}
		}
	};
}
