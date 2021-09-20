import type { PendingQueryItem } from '@iconify/api-redundancy';
import type {
	APIQueryParams,
	IconifyAPIPrepareQuery,
	IconifyAPISendQuery,
	IconifyAPIModule,
	GetIconifyAPIModule,
} from '../modules';
import type { GetAPIConfig } from '../config';

/**
 * Global
 */
type Callback = (data: unknown) => void;
type JSONPRoot = Record<string, Callback>;
let rootVar: JSONPRoot | null = null;

/**
 * Endpoint
 */
let endPoint = '{prefix}.js?icons={icons}&callback={callback}';

/**
 * Cache: provider:prefix = value
 */
const maxLengthCache: Record<string, number> = Object.create(null);
const pathCache: Record<string, string> = Object.create(null);

/**
 * Get hash for query
 *
 * Hash is used in JSONP callback name, so same queries end up with same JSONP callback,
 * allowing response to be cached in browser.
 */
function hash(str: string): number {
	let total = 0,
		i;

	for (i = str.length - 1; i >= 0; i--) {
		total += str.charCodeAt(i);
	}

	return total % 999;
}

/**
 * Get root object
 */
function getGlobal(): JSONPRoot {
	// Create root
	if (rootVar === null) {
		// window
		const globalRoot = self as unknown as Record<string, unknown>;

		// Test for window.Iconify. If missing, create 'IconifyJSONP'
		let prefix = 'Iconify';
		let extraPrefix = '.cb';

		if (globalRoot[prefix] === void 0) {
			// Use 'IconifyJSONP' global
			prefix = 'IconifyJSONP';
			extraPrefix = '';
			if (globalRoot[prefix] === void 0) {
				globalRoot[prefix] = Object.create(null);
			}
			rootVar = globalRoot[prefix] as JSONPRoot;
		} else {
			// Use 'Iconify.cb'
			const iconifyRoot = globalRoot[prefix] as Record<string, JSONPRoot>;
			if (iconifyRoot.cb === void 0) {
				iconifyRoot.cb = Object.create(null);
			}
			rootVar = iconifyRoot.cb;
		}

		// Change end point
		endPoint = endPoint.replace(
			'{callback}',
			prefix + extraPrefix + '.{cb}'
		);
	}

	return rootVar;
}

/**
 * Return API module
 */
export const getAPIModule: GetIconifyAPIModule = (
	getAPIConfig: GetAPIConfig
): IconifyAPIModule => {
	/**
	 * Calculate maximum icons list length for prefix
	 */
	function calculateMaxLength(provider: string, prefix: string): number {
		// Get config and store path
		const config = getAPIConfig(provider);
		if (!config) {
			return 0;
		}

		// Calculate
		let result;
		if (!config.maxURL) {
			result = 0;
		} else {
			let maxHostLength = 0;
			config.resources.forEach((item) => {
				const host = item as string;
				maxHostLength = Math.max(maxHostLength, host.length);
			});

			// Make sure global is set
			getGlobal();

			// Extra width: prefix (3) + counter (4) - '{cb}' (4)
			const extraLength = 3;

			// Get available length
			result =
				config.maxURL -
				maxHostLength -
				config.path.length -
				endPoint
					.replace('{provider}', provider)
					.replace('{prefix}', prefix)
					.replace('{icons}', '').length -
				extraLength;
		}

		// Cache stuff and return result
		const cacheKey = provider + ':' + prefix;
		pathCache[cacheKey] = config.path;
		maxLengthCache[cacheKey] = result;
		return result;
	}

	/**
	 * Prepare params
	 */
	const prepare: IconifyAPIPrepareQuery = (
		provider: string,
		prefix: string,
		icons: string[]
	): APIQueryParams[] => {
		const results: APIQueryParams[] = [];

		// Get maximum icons list length
		const cacheKey = provider + ':' + prefix;
		let maxLength = maxLengthCache[cacheKey];
		if (maxLength === void 0) {
			maxLength = calculateMaxLength(provider, prefix);
		}

		// Split icons
		let item: APIQueryParams = {
			provider,
			prefix,
			icons: [],
		};
		let length = 0;
		icons.forEach((name, index) => {
			length += name.length + 1;
			if (length >= maxLength && index > 0) {
				// Next set
				results.push(item);
				item = {
					provider,
					prefix,
					icons: [],
				};
				length = name.length;
			}

			item.icons.push(name);
		});
		results.push(item);

		return results;
	};

	/**
	 * Load icons
	 */
	const send: IconifyAPISendQuery = (
		host: string,
		params: APIQueryParams,
		status: PendingQueryItem
	): void => {
		const provider = params.provider;
		const prefix = params.prefix;
		const icons = params.icons;
		const iconsList = icons.join(',');
		const cacheKey = provider + ':' + prefix;

		// Create callback prefix
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const cbPrefix = prefix.split('-').shift()!.slice(0, 3);

		const global = getGlobal();

		// Callback hash
		let cbCounter = hash(
			provider + ':' + host + ':' + prefix + ':' + iconsList
		);
		while (global[cbPrefix + cbCounter] !== void 0) {
			cbCounter++;
		}
		const callbackName = cbPrefix + cbCounter;

		const path =
			pathCache[cacheKey] +
			endPoint
				.replace('{provider}', provider)
				.replace('{prefix}', prefix)
				.replace('{icons}', iconsList)
				.replace('{cb}', callbackName);

		global[callbackName] = (data: unknown): void => {
			// Remove callback and complete query
			delete global[callbackName];
			status.done(data);
		};

		// Create URI
		const uri = host + path;
		// console.log('API query:', uri);

		// Create script and append it to head
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = uri;
		document.head.appendChild(script);
	};

	// Return functions
	return {
		prepare,
		send,
	};
};
