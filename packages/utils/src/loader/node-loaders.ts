import { promises as fs } from 'fs';
import type { Awaitable, CustomIconLoader, CustomHMRIconLoader } from './types';
import { camelize, pascalize, snakelize } from '../misc/strings';
import { resolve } from 'node:path';
import { normalizePath } from './hmr-utils';

/**
 * @returns A {@link CustomIconLoader} for loading icons from a directory.
 */
export function FileSystemIconLoader(
	dir: string,
	transform?: (svg: string) => Awaitable<string>
): CustomIconLoader {
	return async (name) => {
		return await resolveIcon(name, dir, transform).then(result => result?.svg);
	};
}

/**
 * Creates a {@link CustomHMRIconLoader} collection from a directory with HMR support.
 *
 * @example
 * ```ts
 * customCollections: {
 *   ...FileSystemHMRIconLoader('./src/icons', 'custom-icons')
 * }
 * ```
 *
 * @param dir The directory relative to the root.
 * @param collectionName The collection name.
 * @param transform The SVG transformer.
 */
export function FileSystemHMRIconLoader(
	dir: string,
	collectionName: string,
	transform?: (svg: string) => Awaitable<string>,
): Record<string, CustomHMRIconLoader> {
	const normalizedDir = normalizePath(resolve(dir))
	const pathToName = new Map<string, string>()
	const nameToPath = new Map<string, string>()
	const customCollection: Record<string, CustomHMRIconLoader> = {}
	customCollection[collectionName] = {
		__iconifyCustomHmrIconLoader: true,
		name: collectionName,
		iconLoader: async (name) => {
			const result = await resolveIcon(
				name,
				normalizedDir,
				transform,
			)
			if (result) {
				pathToName.set(result.path, result.name)
				nameToPath.set(result.name, result.path)
			}
			return result?.svg
		},
		resolveModuleIconName: (normalizedSVGPath) => {
			return pathToName.get(normalizedSVGPath)
		},
		resolveSVGIconPath: name => nameToPath.get(name),
	}

	return customCollection
}

interface ResolvedIcon {
	path: string;
	name: string;
	svg: string;
}

async function resolveIcon(
	name: string,
	dir: string,
	transform?: (svg: string) => Awaitable<string>,
): Promise<ResolvedIcon | undefined> {
	const candidates = [
		`${dir}/${name}.svg`,
		`${dir}/${camelize(name)}.svg`,
		`${dir}/${pascalize(name)}.svg`,
		`${dir}/${snakelize(name)}.svg`,
	]

	for (const path of candidates) {
		let stat
		try {
			stat = await fs.lstat(path)
		}
		catch {
			continue
		}
		if (stat.isFile()) {
			let svg = await fs.readFile(path, 'utf-8')
			const cleanupIdx = svg.indexOf('<svg')
			if (cleanupIdx > 0) {
				svg = svg.slice(cleanupIdx)
			}
			return {
				path,
				name,
				svg: typeof transform === 'function' ? await transform(svg) : svg,
			}
		}
	}
	return undefined
}
