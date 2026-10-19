import type { RedundancyConfig } from '@iconify/api-redundancy';

/**
 * API config
 */
export interface IconifyAPIConfig extends RedundancyConfig {
	// Root path, after domain name and before prefix
	path: string;

	// URL length limit
	maxURL: number;
}

export type PartialIconifyAPIConfig = Partial<IconifyAPIConfig> &
	Pick<IconifyAPIConfig, 'resources'>;

/**
 * Create full API configuration from partial data
 */
export function createAPIConfig(
	source: PartialIconifyAPIConfig
): IconifyAPIConfig | null {
	let resources;
	if (typeof source.resources === 'string') {
		resources = [source.resources];
	} else {
		resources = source.resources;
		if (!(resources instanceof Array) || !resources.length) {
			return null;
		}
	}

	const result: IconifyAPIConfig = {
		// API hosts
		resources: resources,

		// Root path
		path: source.path || '/',

		// URL length limit
		maxURL: source.maxURL || 500,

		// Timeout before next host is used.
		rotate: source.rotate || 750,

		// Timeout before failing query.
		timeout: source.timeout || 5000,

		// Randomise default API end point.
		random: source.random === true,

		// Start index
		index: source.index || 0,

		// Receive data after time out (used if time out kicks in first, then API module sends data anyway).
		dataAfterTimeout: source.dataAfterTimeout !== false,
	};

	return result;
}

/**
 * Local storage
 */
const configStorage = Object.create(null) as Record<string, IconifyAPIConfig>;

// Add default API
configStorage[''] = createAPIConfig({
	resources: ['https://api.iconify.design'],
}) as IconifyAPIConfig;

/**
 * Add custom config for provider
 */
export function addAPIProvider(
	provider: string,
	customConfig: PartialIconifyAPIConfig
): boolean {
	const config = createAPIConfig(customConfig);
	if (config === null) {
		return false;
	}
	configStorage[provider] = config;
	return true;
}

/**
 * Signature for getAPIConfig
 */
export type GetAPIConfig = (provider: string) => IconifyAPIConfig | undefined;

/**
 * Get API configuration
 */
export function getAPIConfig(provider: string): IconifyAPIConfig | undefined {
	return configStorage[provider];
}

/**
 * List API providers
 */
export function listAPIProviders(): string[] {
	return Object.keys(configStorage);
}
