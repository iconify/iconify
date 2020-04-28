import { RedundancyConfig } from '@cyberalien/redundancy';
import { merge } from '../misc/merge';

/**
 * API config
 */
export interface IconifyAPIConfig extends RedundancyConfig {
	// Root path, after domain name and before prefix
	path: string;

	// URL length limit
	maxURL: number;
}

/**
 * Local storage interfaces
 */
interface ConfigStorage {
	// API configuration for all prefixes
	default: IconifyAPIConfig;

	// Prefix specific API configuration
	prefixes: Record<string, IconifyAPIConfig>;
}

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

/**
 * Default configuration
 */
const defaultConfig: IconifyAPIConfig = {
	// API hosts
	resources: ['https://api.iconify.design'].concat(fallBackAPI),

	// Root path
	path: '/',

	// URL length limit
	maxURL: 500,

	// Timeout before next host is used.
	rotate: 750,

	// Timeout to retry same host.
	timeout: 5000,

	// Number of attempts for each host.
	limit: 2,

	// Randomise default API end point.
	random: false,

	// Start index
	index: 0,
};

/**
 * Local storage
 */
const configStorage: ConfigStorage = {
	default: defaultConfig,
	prefixes: Object.create(null),
};

/**
 * Add custom config for prefix(es)
 *
 * This function should be used before any API queries.
 * On first API query computed configuration will be cached, so changes to config will not take effect.
 */
export function setAPIConfig(
	customConfig: Partial<IconifyAPIConfig>,
	prefix?: string | string[]
): void {
	const mergedConfig = merge(
		configStorage.default,
		customConfig
	) as IconifyAPIConfig;
	if (prefix === void 0) {
		configStorage.default = mergedConfig;
		return;
	}
	(typeof prefix === 'string' ? [prefix] : prefix).forEach(prefix => {
		configStorage.prefixes[prefix] = mergedConfig;
	});
}

/**
 * Get API configuration
 */
export function getAPIConfig(prefix: string): IconifyAPIConfig | null {
	const value = configStorage.prefixes[prefix];
	return value === void 0 ? configStorage.default : value;
}
