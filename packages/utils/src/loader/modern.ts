import { promises as fs } from 'fs';
import type { IconifyJSON } from '@iconify/types';
import type { FullIconifyIcon } from '../icon';
import { iconToSVG } from '../svg/build';
import { getIconData } from '../icon-set/get-icon';
import { mergeIconProps, tryInstallPkg } from './utils';
import createDebugger from 'debug';
import { isPackageExists, resolveModule } from 'local-pkg';
import { defaults as DefaultIconCustomizations } from '../customisations';
import type { IconCustomizations } from './types';

const debug = createDebugger('@iconify-loader:icon');
const debugModern = createDebugger('@iconify-loader:modern');
const debugLegacy = createDebugger('@iconify-loader:legacy');

const _collections: Record<string, Promise<IconifyJSON | undefined>> = {};
const isLegacyExists = isPackageExists('@iconify/json');

export async function loadCollection(name: string, autoInstall = false): Promise<IconifyJSON | undefined> {
	if (!_collections[name]) {
		_collections[name] = task();
	}

	return _collections[name];

	async function task(): Promise<IconifyJSON | undefined> {
		let jsonPath = resolveModule(`@iconify-json/${name}/icons.json`);
		if (jsonPath) {
			debugModern(name);
		}

		if (!jsonPath && isLegacyExists) {
			jsonPath = resolveModule(`@iconify/json/json/${name}.json`);
			if (jsonPath) {
				debugLegacy(name);
			}
		}

		if (!jsonPath && !isLegacyExists && autoInstall) {
			await tryInstallPkg(`@iconify-json/${name}`);
			jsonPath = resolveModule(`@iconify-json/${name}/icons.json`);
		}

		if (jsonPath) {
			return JSON.parse(await fs.readFile(jsonPath, 'utf8'));
		}
		else {
			debugModern(`failed to load ${name}`);
			return undefined;
		}
	}
}

export async function searchForIcon(
	iconSet: IconifyJSON,
	collection: string,
	ids: string[],
	iconCustomizactions?: IconCustomizations,
): Promise<string | undefined> {
	let iconData: FullIconifyIcon | null;
	const { customize, additionalProps = {}, iconCustomizer } = iconCustomizactions || {}
	for (const id of ids) {
		iconData = getIconData(iconSet, id, true);
		if (iconData) {
			debug(`${collection}:${id}`);
			const defaultCustomizations = { ...DefaultIconCustomizations }
			const { attributes, body } = iconToSVG(
				iconData,
				typeof customize === 'function' ? customize(defaultCustomizations) : defaultCustomizations
			);
			return await mergeIconProps(
				`<svg>${body}</svg>`,
				collection,
				id,
				additionalProps,
				() => attributes,
				iconCustomizer,
			)
		}
	}
}
