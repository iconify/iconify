/**
 * Resource to rotate (usually hostname or partial URL)
 */
export type RedundancyResource = string;

/**
 * Configuration object
 */
export interface RedundancyConfig {
	resources: RedundancyResource[]; // Resources to rotate
	index: number; // Start index
	timeout: number; // Timeout for error (full timeout = timeout + resources.length * rotate)
	rotate: number; // Timeout for one query
	random: boolean; // True if order should be randomised
	dataAfterTimeout: boolean; // True if data can be sent after timeout
}

/**
 * Default RedundancyConfig for API calls
 */
export const defaultConfig: RedundancyConfig = {
	resources: [],
	index: 0,
	timeout: 2000,
	rotate: 750,
	random: false,
	dataAfterTimeout: false,
};
