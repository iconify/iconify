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
 * Response from query module
 */
export type QueryModuleResponseData = unknown;

/**
 * Callback
 *
 * If error is present, something went wrong and data is undefined. If error is undefined, data is set.
 */
export type QueryDoneCallback = (
	data?: QueryModuleResponseData,
	error?: QueryModuleResponseData
) => void;

/**
 * Callback for "abort" pending item.
 */
export type QueryAbortCallback = () => void;

/**
 * Response from query module
 */
export type QueryModuleResponseType = 'success' | 'next' | 'abort';
export type QueryModuleResponse = (
	status: QueryModuleResponseType,
	data: QueryModuleResponseData
) => void;

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
interface PendingQueryItem {
	status: QueryItemStatus; // Current query status
	readonly resource: RedundancyResource; // Resource
	readonly callback: QueryModuleResponse; // Function to call with data
}

/**
 * Function to send to item to send query
 */
export type QueryModuleCallback = (
	resource: RedundancyResource,
	payload: QueryPayload,
	callback: QueryModuleResponse
) => void;

/**
 * Send query
 */
export function sendQuery(
	config: RedundancyConfig,
	payload: QueryPayload,
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
	let lastError: QueryModuleResponseData | undefined;

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
		queue.forEach((item) => {
			if (item.status === 'pending') {
				item.status = 'aborted';
			}
		});
		queue = [];
	}

	/**
	 * Got response from module
	 */
	function moduleResponse(
		item: PendingQueryItem,
		response: QueryModuleResponseType,
		data: QueryModuleResponseData
	): void {
		const isError = response !== 'success';

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

		// Abort
		if (response === 'abort') {
			lastError = data;
			failQuery();
			return;
		}

		// Error
		if (isError) {
			lastError = data;
			if (!queue.length) {
				if (!resources.length) {
					// Nothing else queued, nothing can be queued
					failQuery();
				} else {
					// Queue is empty: run next item immediately
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
			status: 'pending',
			resource,
			callback: (status, data) => {
				moduleResponse(item, status, data);
			},
		};

		// Add to queue
		queue.push(item);

		// Bump next index
		queriesSent++;

		// Create timer
		timer = setTimeout(execNext, config.rotate);

		// Execute it
		query(resource, payload, item.callback);
	}

	// Execute first query on next tick
	setTimeout(execNext);

	// Return getQueryStatus()
	return getQueryStatus;
}
