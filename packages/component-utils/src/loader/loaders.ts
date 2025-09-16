import type { LoaderConfig } from './types.js';

const providerSpecificLoaders = Object.create(null) as Record<
	string,
	LoaderConfig
>;

const prefixSpecificLoaders = Object.create(null) as Record<
	string,
	LoaderConfig
>;

/**
 * Set custom loader for an icon set
 */
export function setLoader(prefix: string, loader: LoaderConfig) {
	prefixSpecificLoaders[prefix] = loader;
}

/**
 * Set custom loader for a provider
 */
export function setProviderLoader(provider: string, loader: LoaderConfig) {
	providerSpecificLoaders[provider] = loader;
}

/**
 * Get loader
 */
export function getLoader(
	provider: string,
	prefix: string
): LoaderConfig | undefined {
	return provider
		? providerSpecificLoaders[provider]
		: prefixSpecificLoaders[prefix] || providerSpecificLoaders[''];
}
