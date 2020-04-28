import { RedundancyPendingItem } from '@cyberalien/redundancy';
import {
	APIQueryParams,
	IconifyAPIPrepareQuery,
	IconifyAPISendQuery,
} from '@iconify/core/lib/api/modules';
import { getAPIConfig } from '@iconify/core/lib/api/config';

/**
 * Global
 */
type Callback = (data: unknown) => void;
type JSONPRoot = Record<string, Callback>;
let global: JSONPRoot | null = null;

/**
 * Endpoint
 */
let endPoint = '{prefix}.js?icons={icons}&callback={callback}';

/**
 * Cache
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
	if (global === null) {
		// window
		const globalRoot = (self as unknown) as Record<string, unknown>;

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
			global = globalRoot[prefix] as JSONPRoot;
		} else {
			// Use 'Iconify.cb'
			const iconifyRoot = globalRoot[prefix] as Record<string, JSONPRoot>;
			if (iconifyRoot.cb === void 0) {
				iconifyRoot.cb = Object.create(null);
			}
			global = iconifyRoot.cb;
		}

		// Change end point
		endPoint = endPoint.replace(
			'{callback}',
			prefix + extraPrefix + '.{cb}'
		);
	}

	return global;
}

/**
 * Calculate maximum icons list length for prefix
 */
function calculateMaxLength(prefix: string): number {
	// Get config and store path
	const config = getAPIConfig(prefix);
	if (!config) {
		return 0;
	}

	// Calculate
	let result;
	if (!config.maxURL) {
		result = 0;
	} else {
		let maxHostLength = 0;
		config.resources.forEach((host) => {
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
			endPoint.replace('{prefix}', prefix).replace('{icons}', '').length -
			extraLength;
	}

	// Cache stuff and return result
	pathCache[prefix] = config.path;
	maxLengthCache[prefix] = result;
	return result;
}

/**
 * Prepare params
 */
export const prepareQuery: IconifyAPIPrepareQuery = (
	prefix: string,
	icons: string[]
): APIQueryParams[] => {
	const results: APIQueryParams[] = [];

	// Get maximum icons list length
	let maxLength = maxLengthCache[prefix];
	if (maxLength === void 0) {
		maxLength = calculateMaxLength(prefix);
	}

	// Split icons
	let item: APIQueryParams = {
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
export const sendQuery: IconifyAPISendQuery = (
	host: string,
	params: APIQueryParams,
	status: RedundancyPendingItem
): void => {
	const prefix = params.prefix;
	const icons = params.icons;
	const iconsList = icons.join(',');

	// Create callback prefix
	const cbPrefix = prefix.split('-').shift().slice(0, 3);

	const global = getGlobal();

	// Callback hash
	let cbCounter = hash(host + ':' + prefix + ':' + iconsList);
	while (global[cbPrefix + cbCounter] !== void 0) {
		cbCounter++;
	}
	const callbackName = cbPrefix + cbCounter;

	let path =
		pathCache[prefix] +
		endPoint
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
