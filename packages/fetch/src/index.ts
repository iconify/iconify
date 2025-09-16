// Cache for last successful fetches
const indexCache = new Map<string, number>();

// Delay
const delay = 750;

// Fetch
let _fetch = fetch;

/**
 * Set custom fetch function
 */
export function setFetch(fetchFn: typeof fetch) {
	_fetch = fetchFn;
}

/**
 * Fetch JSON data
 */
export function fetchJSON<T>(
	hosts: string[],
	endpoint: string,
	init?: RequestInit,
	controller?: AbortController
): Promise<T> {
	// Get last successful index from cache
	const cacheKey = hosts.join(',');
	const startIndex = indexCache.get(cacheKey) || 0;
	const total = hosts.length;

	// Params
	controller = controller || new AbortController();
	init = init || {};
	init.signal = controller.signal;

	// Create promises array
	const promises: Promise<T>[] = [];

	for (let i = 0; i < total; i++) {
		const scopeIndex = i;
		const index = (startIndex + scopeIndex) % total;
		const host = hosts[index];
		const url = `${host}${endpoint}`;

		// Create fetch promise
		const promise = async () => {
			// Wait for delay
			for (let i = 0; i < scopeIndex; i++) {
				await new Promise((resolve) => setTimeout(resolve, delay));
				if (controller.signal.aborted) {
					throw new Error('Fetch aborted');
				}
			}

			// Fetch data
			const response = await _fetch(url, init);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = (await response.json()) as Promise<T>;

			// Update cache with successful index
			indexCache.set(cacheKey, index);

			// Abort other requests
			controller.abort();

			// Return result
			return result;
		};

		promises.push(promise());
	}

	// Return first successful promise
	return Promise.any(promises);
}
