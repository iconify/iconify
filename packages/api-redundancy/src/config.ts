/**
 * Callback for "timeout" configuration property.
 * Returns number of milliseconds to wait before failing query, while there are pending resources.
 */
export interface TimeoutCallback {
	(
		startTime: number // Start time
	): number;
}

/**
 * Callback for "rotate" configuration property.
 * Returns number of milliseconds to wait before trying next resource.
 */
export interface RotationTimeoutCallback {
	(
		queriesSent: number, // Number of queries sent, starts with 1 for timeout after first resource
		startTime: number // Query start time
	): number;
}

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
	timeout: number | TimeoutCallback; // Timeout for error (full timeout = timeout + resources.length * rotate)
	rotate: number | RotationTimeoutCallback; // Timeout for one query
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
