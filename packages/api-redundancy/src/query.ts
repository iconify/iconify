import type { RedundancyConfig, RedundancyResource } from './config';
// import type { Redundancy } from './redundancy';

/**
 * Execution status
 */
type QueryItemStatus = 'pending' | 'completed' | 'aborted' | 'failed';

/**
 * Custom payload
 */
type QueryPayload = unknown;

/**
 * Callback
 *
 * If error is present, something went wrong and data is undefined. If error is undefined, data is set.
 */
export type QueryDoneCallback = (data?: unknown, error?: unknown) => void;

/**
 * Callback for "abort" pending item.
 */
export type QueryAbortCallback = () => void;

/**
 * Callback to call to update last successful resource index. Used by Resundancy class to automatically update config.
 */
export type QueryUpdateIndexCallback = (index: number) => void;

/**
 * Status for query
 */
export interface QueryStatus {
	readonly abort: () => void; // Function to call to abort everything
	readonly subscribe: (
		callback?: QueryDoneCallback,
		overwrite?: boolean
	) => void; // Add function to call when query is complete
	readonly payload: QueryPayload; // Payload
	status: QueryItemStatus; // Query status (global, not specific to one query)
	startTime: number; // Time when function was called
	queriesSent: number; // Number of queries sent
	queriesPending: number; // Number of pending queries
}

/**
 * Callback to track status
 */
export type GetQueryStatus = () => QueryStatus;

/**
 * Item in pending items list
 */
export interface PendingQueryItem {
	readonly getQueryStatus: GetQueryStatus;
	status: QueryItemStatus; // Current query status
	readonly resource: RedundancyResource; // Resource
	readonly done: QueryDoneCallback; // Function to call with data
	abort?: QueryAbortCallback; // Function to call to abort query, set by query handler
}

/**
 * Function to send to item to send query
 */
export type QueryModuleCallback = (
	resource: RedundancyResource,
	payload: QueryPayload,
	queryItem: PendingQueryItem
) => void;

/**
 * Send query
 */
export function sendQuery(
	config: RedundancyConfig,
	payload: unknown,
	query: QueryModuleCallback,
	done?: QueryDoneCallback
): GetQueryStatus {
	// Get number of resources
	const resourcesCount = config.resources.length;

	// Save start index
	const startIndex = config.random
		? Math.floor(Math.random() * resourcesCount)
		: config.index;

	// Get resources
	let resources: RedundancyResource[];
	if (config.random) {
		// Randomise array
		let list = config.resources.slice(0);
		resources = [];
		while (list.length > 1) {
			const nextIndex = Math.floor(Math.random() * list.length);
			resources.push(list[nextIndex]);
			list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
		}
		resources = resources.concat(list);
	} else {
		// Rearrange resources to start with startIndex
		resources = config.resources
			.slice(startIndex)
			.concat(config.resources.slice(0, startIndex));
	}

	// Counters, status
	const startTime = Date.now();
	let status: QueryItemStatus = 'pending';
	let queriesSent = 0;
	let lastError: unknown = void 0;

	// Timer
	let timer: ReturnType<typeof setTimeout> | null = null;

	// Execution queue
	let queue: PendingQueryItem[] = [];

	// Callbacks to call when query is complete
	let doneCallbacks: QueryDoneCallback[] = [];
	if (typeof done === 'function') {
		doneCallbacks.push(done);
	}

	/**
	 * Reset timer
	 */
	function resetTimer(): void {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}

	/**
	 * Abort everything
	 */
	function abort(): void {
		// Change status
		if (status === 'pending') {
			status = 'aborted';
		}

		// Reset timer
		resetTimer();

		// Abort all queued items
		queue.forEach((item) => {
			if (item.abort) {
				item.abort();
			}
			if (item.status === 'pending') {
				item.status = 'aborted';
			}
		});
		queue = [];
	}

	/**
	 * Add / replace callback to call when execution is complete.
	 * This can be used to abort pending query implementations when query is complete or aborted.
	 */
	function subscribe(
		callback?: QueryDoneCallback,
		overwrite?: boolean
	): void {
		if (overwrite) {
			doneCallbacks = [];
		}
		if (typeof callback === 'function') {
			doneCallbacks.push(callback);
		}
	}

	/**
	 * Get query status
	 */
	function getQueryStatus(): QueryStatus {
		return {
			startTime,
			payload,
			status,
			queriesSent,
			queriesPending: queue.length,
			subscribe,
			abort,
		};
	}

	/**
	 * Fail query
	 */
	function failQuery(): void {
		status = 'failed';

		// Send notice to all callbacks
		doneCallbacks.forEach((callback) => {
			callback(void 0, lastError);
		});
	}

	/**
	 * Clear queue
	 */
	function clearQueue(): void {
		queue = queue.filter((item) => {
			if (item.status === 'pending') {
				item.status = 'aborted';
			}
			if (item.abort) {
				item.abort();
			}
			return false;
		});
	}

	/**
	 * Got response from module
	 */
	function moduleResponse(
		item: PendingQueryItem,
		data?: unknown,
		error?: unknown
	): void {
		const isError = data === void 0;

		// Remove item from queue
		queue = queue.filter((queued) => queued !== item);

		// Check status
		switch (status) {
			case 'pending':
				// Pending
				break;

			case 'failed':
				if (isError || !config.dataAfterTimeout) {
					// Query has already timed out or dataAfterTimeout is disabled
					return;
				}
				// Success after failure
				break;

			default:
				// Aborted or completed
				return;
		}

		// Error
		if (isError) {
			if (error !== void 0) {
				lastError = error;
			}
			if (!queue.length) {
				if (!resources.length) {
					// Nothing else queued, nothing can be queued
					failQuery();
				} else {
					// Queue is empty: run next item immediately
					// eslint-disable-next-line @typescript-eslint/no-use-before-define
					execNext();
				}
			}
			return;
		}

		// Reset timers, abort pending queries
		resetTimer();
		clearQueue();

		// Update index in configuration
		if (!config.random) {
			const index = config.resources.indexOf(item.resource);
			if (index !== -1 && index !== config.index) {
				config.index = index;
			}
		}

		// Mark as completed and call callbacks
		status = 'completed';
		doneCallbacks.forEach((callback) => {
			callback(data);
		});
	}

	/**
	 * Execute next query
	 */
	function execNext(): void {
		// Check status
		if (status !== 'pending') {
			return;
		}

		// Reset timer
		resetTimer();

		// Get resource
		const resource = resources.shift();
		if (resource === void 0) {
			// Nothing to execute: wait for final timeout before failing
			if (queue.length) {
				// Last timeout before failing to allow late response
				timer = setTimeout(() => {
					resetTimer();
					if (status === 'pending') {
						// Clear queue
						clearQueue();
						failQuery();
					}
				}, config.timeout);
				return;
			}

			// Fail
			failQuery();
			return;
		}

		// Create new item
		const item: PendingQueryItem = {
			getQueryStatus,
			status: 'pending',
			resource,
			done: (data?: unknown, error?: unknown) => {
				moduleResponse(item, data, error);
			},
		};

		// Add to queue
		queue.push(item);

		// Bump next index
		queriesSent++;

		// Create timer
		timer = setTimeout(execNext, config.rotate);

		// Execute it
		query(resource, payload, item);
	}

	// Execute first query on next tick
	setTimeout(execNext);

	// Return getQueryStatus()
	return getQueryStatus;
}
