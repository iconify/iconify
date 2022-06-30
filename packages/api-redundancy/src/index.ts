import type { RedundancyConfig } from './config';
import { defaultConfig } from './config';
import type {
	GetQueryStatus,
	QueryModuleCallback,
	QueryDoneCallback,
} from './query';
import { sendQuery } from './query';

/**
 * Export types from query.ts
 */
export { GetQueryStatus, QueryModuleCallback, QueryDoneCallback };
export type {
	QueryAbortCallback,
	QueryStatus,
	QueryModuleResponseType,
	QueryModuleResponse,
} from './query';

/**
 * Export types from config.ts
 */
export type { RedundancyConfig, RedundancyResource } from './config';

/**
 * Function to filter item
 */
export interface FilterCallback {
	(item: GetQueryStatus): boolean;
}

/**
 * Redundancy instance
 */
export interface Redundancy {
	// Send query
	query: (
		payload: unknown,
		queryCallback: QueryModuleCallback,
		doneCallback?: QueryDoneCallback
	) => GetQueryStatus;

	// Find Query instance
	find: (callback: FilterCallback) => GetQueryStatus | null;

	// Set resource start index. Overrides configuration
	setIndex: (index: number) => void;

	// Get resource start index. Store it in configuration
	getIndex: () => number;

	// Remove aborted and completed queries
	cleanup: () => void;
}

/**
 * Redundancy instance
 */
export function initRedundancy(cfg: Partial<RedundancyConfig>): Redundancy {
	// Configuration
	const config: RedundancyConfig = {
		...defaultConfig,
		...cfg,
	};

	// List of queries
	let queries: GetQueryStatus[] = [];

	/**
	 * Remove aborted and completed queries
	 */
	function cleanup(): void {
		queries = queries.filter((item) => item().status === 'pending');
	}

	/**
	 * Send query
	 */
	function query(
		payload: unknown,
		queryCallback: QueryModuleCallback,
		doneCallback?: QueryDoneCallback
	): GetQueryStatus {
		const query = sendQuery(
			config,
			payload,
			queryCallback,
			(data, error) => {
				// Remove query from list
				cleanup();

				// Call callback
				if (doneCallback) {
					doneCallback(data, error);
				}
			}
		);
		queries.push(query);
		return query;
	}

	/**
	 * Find instance
	 */
	function find(callback: FilterCallback): GetQueryStatus | null {
		return (
			queries.find((value) => {
				return callback(value);
			}) || null
		);
	}

	// Create and return functions
	const instance: Redundancy = {
		query,
		find,
		setIndex: (index: number) => {
			config.index = index;
		},
		getIndex: () => config.index,
		cleanup,
	};

	return instance;
}
