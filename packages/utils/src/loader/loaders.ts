import type { Awaitable } from '@antfu/utils';
import { existsSync, promises as fs } from 'fs';
import type { CustomIconLoader } from './types';
import { camelize, pascalize } from '../misc/strings';

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
			if (existsSync(path)) {
				const svg = await fs.readFile(path, 'utf-8');
				return typeof transform === 'function'
					? await transform(svg)
					: svg;
			}
		}
	};
}
