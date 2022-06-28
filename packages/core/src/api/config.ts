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

/**
 * Redundancy for API servers.
 *
 * API should have very high uptime because of implemented redundancy at server level, but
 * sometimes bad things happen. On internet 100% uptime is not possible.
 *
 * There could be routing problems. Server might go down for whatever reason, but it takes
 * few minutes to detect that downtime, so during those few minutes API might not be accessible.
 *
 * This script has some redundancy to mitigate possible network issues.
 *
 * If one host cannot be reached in 'rotate' (750 by default) ms, script will try to retrieve
 * data from different host. Hosts have different configurations, pointing to different
 * API servers hosted at different providers.
 */
const fallBackAPISources = [
	'https://api.simplesvg.com',
	'https://api.unisvg.com',
];

// Shuffle fallback API
const fallBackAPI: string[] = [];
while (fallBackAPISources.length > 0) {
	if (fallBackAPISources.length === 1) {
		fallBackAPI.push(fallBackAPISources.shift() as string);
	} else {
		// Get first or last item
		if (Math.random() > 0.5) {
			fallBackAPI.push(fallBackAPISources.shift() as string);
		} else {
			fallBackAPI.push(fallBackAPISources.pop() as string);
		}
	}
}

// Add default API
configStorage[''] = createAPIConfig({
	resources: ['https://api.iconify.design'].concat(fallBackAPI),
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
