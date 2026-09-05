import type {
	Awaitable,
	CustomCollectionIconLoader,
	CustomHMRIconLoader,
} from './types';

const normalizeRegexp = /\\/g
export function normalizePath(path: string): string {
	return path.replace(normalizeRegexp, '/')
}

export function isCustomHMRIconLoader(loader: CustomCollectionIconLoader): loader is CustomHMRIconLoader {
	return typeof loader === 'function'
		? false
		: (
			'__iconifyCustomHmrIconLoader' in loader && loader.__iconifyCustomHmrIconLoader === true
			&& 'name' in loader && typeof loader.name === 'string'
			&& 'iconLoader' in loader && typeof loader.iconLoader === 'function'
			&& 'resolveModuleIconName' in loader && typeof loader.resolveModuleIconName === 'function'
			&& 'resolveSVGIconPath' in loader && typeof loader.resolveSVGIconPath === 'function'
		)
}

export type FindModuleFn<T> = (collection: string, icon: string) => Awaitable<T[] | undefined>

export interface HMRSupport<T> {
	hmrCustomIconResolvers: CustomHMRIconLoader[]
	resolveModuleIconName: (normalizedSVGPath: string) => Promise<T[] | undefined>
	resolveSVGIconPath: (collectionName: string, iconName: string) => string | undefined
}

export function collectCustomHMRIconResolvers(
	customCollections: Record<string, CustomCollectionIconLoader> = {},
): Map<string, CustomHMRIconLoader> {
	const hmrCustomIconResolversMap = new Map<string, CustomHMRIconLoader>()
	for (const collection of Object.values(customCollections)) {
		if (isCustomHMRIconLoader(collection)) {
			hmrCustomIconResolversMap.set(collection.name, collection)
		}
	}
	return hmrCustomIconResolversMap
}

export function createHMRHelper<T>(
	findModules: FindModuleFn<T>,
	customCollections: Record<string, CustomCollectionIconLoader> = {},
): HMRSupport<T> {
	const hmrCustomIconResolversMap = collectCustomHMRIconResolvers(customCollections)
	const hmrCustomIconResolvers = Array.from(hmrCustomIconResolversMap.values())

	return {
		hmrCustomIconResolvers,
		resolveModuleIconName: async (svgPath) => {
			const normalizedSVGPath = normalizePath(svgPath)
			for (const resolver of hmrCustomIconResolvers) {
				const icon = resolver.resolveModuleIconName(normalizedSVGPath)
				if (icon) {
					const modules = await findModules(resolver.name, icon)
					if (modules && modules.length > 0) {
						return modules
					}
				}
			}
			return undefined
		},
		resolveSVGIconPath: (collectionName, iconName) => {
			return hmrCustomIconResolversMap.get(collectionName)?.resolveSVGIconPath(iconName)
		},
	}
}
