import { AutoInstall, CustomIconLoader, ExternalPkgName } from './types';
import { loadCollectionFromFS } from './fs';
import { searchForIcon } from './modern';
import { warnOnce } from './warn';

/**
 * Creates a CustomIconLoader collection from an external package collection.
 *
 * @param packageName The package name.
 * @param autoInstall {AutoInstall} [autoInstall=false] - whether to automatically install
 */
export function createExternalPackageIconLoader(
	packageName: ExternalPkgName,
	autoInstall: AutoInstall = false
) {
	let scope: string;
	let collection: string;
	const collections: Record<string, CustomIconLoader> = {};
	if (typeof packageName === 'string') {
		if (packageName.length === 0) {
			warnOnce(`invalid package name, it is empty`);
			return collections;
		}
		if (packageName[0] === '@') {
			if (packageName.indexOf('/') === -1) {
				warnOnce(`invalid scoped package name "${packageName}"`);
				return collections;
			}
			[scope, collection] = packageName.split('/');
		} else {
			scope = '';
			collection = packageName;
		}
	} else {
		[scope, collection] = packageName;
	}

	collections[collection] = createCustomIconLoader(
		scope,
		collection,
		autoInstall
	);

	return collections;
}

function createCustomIconLoader(
	scope: string,
	collection: string,
	autoInstall: AutoInstall
) {
	// create the custom collection loader
	const iconSetPromise = loadCollectionFromFS(collection, autoInstall, scope);
	return <CustomIconLoader>(async (icon) => {
		// await until the collection is loaded
		const iconSet = await iconSetPromise;
		// copy/paste from ./node-loader.ts
		let result: string | undefined;
		if (iconSet) {
			// possible icon names
			const ids = [
				icon,
				icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
				icon.replace(/([a-z])(\d+)/g, '$1-$2'),
			];
			result = await searchForIcon(iconSet, collection, ids);
		}

		return result;
	});
}
