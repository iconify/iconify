import { promises as fs } from 'fs';
import type { IconifyJSON } from '@iconify/types';
import type { FullIconifyIcon } from '@iconify/utils/lib/icon';
import { defaultCustomisations as DefaultIconCustomizations, iconToSVG, getIconData, tryInstallPkg } from '@iconify/utils';
import createDebugger from 'debug';
import { isPackageExists, resolveModule } from 'local-pkg';
import type { FullIconCustomisations } from '@iconify/utils/lib/customisations';

const debug = createDebugger('@iconify-core:icon');
const debugModern = createDebugger('@iconify-core:modern');
const debugLegacy = createDebugger('@iconify-core:legacy');

export interface ResolvedIconPath {
	collection: string
	icon: string
	query: Record<string, string | undefined>
}

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

export function searchForIcon(iconSet: IconifyJSON, collection: string, ids: string[], customize?: (defaults: FullIconCustomisations) => void): string | null {
	let iconData: FullIconifyIcon | null;
	for (const id of ids) {
		iconData = getIconData(iconSet, id, true);
		if (iconData) {
			debug(`${collection}:${id}`);
			const customizations: FullIconCustomisations = { ...DefaultIconCustomizations }
			customize?.(customizations)
			const { attributes, body } = iconToSVG(iconData, customizations);
			return `<svg ${Object.entries(attributes).map(i => `${i[0]}="${i[1]}"`).join(' ')}>${body}</svg>`;
		}
	}
	return null;
}
