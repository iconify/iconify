import { RedundancyPendingItem } from '@cyberalien/redundancy';

/**
 * Params for sendQuery()
 */
export interface APIQueryParams {
	prefix: string;
	icons: string[];
}

/**
 * Functions to implement in module
 */
export type IconifyAPIPrepareQuery = (
	prefix: string,
	icons: string[]
) => APIQueryParams[];

export type IconifyAPISendQuery = (
	host: string,
	params: APIQueryParams,
	status: RedundancyPendingItem
) => void;

/**
 * API modules
 */
export interface IconifyAPIModule {
	prepare: IconifyAPIPrepareQuery;
	send: IconifyAPISendQuery;
}

/**
 * Local storate types and entries
 */
interface ModuleStorage {
	default: IconifyAPIModule | null;
	prefixes: Record<string, IconifyAPIModule>;
}

const storage: ModuleStorage = {
	default: null,
	prefixes: Object.create(null),
};

/**
 * Set API module
 *
 * If prefix is not set, function sets default method.
 * If prefix is a string or array of strings, function sets method only for those prefixes.
 *
 * This should be used before sending any API requests. If used after sending API request, method
 * is already cached so changing callback will not have any effect.
 */
export function setAPIModule(
	item: IconifyAPIModule,
	prefix?: string | string[]
): void {
	if (prefix === void 0) {
		storage.default = item;
		return;
	}

	(typeof prefix === 'string' ? [prefix] : prefix).forEach(prefix => {
		storage.prefixes[prefix] = item;
	});
}

/**
 * Get API module
 */
export function getAPIModule(prefix: string): IconifyAPIModule | null {
	const value = storage.prefixes[prefix];
	return value === void 0 ? storage.default : value;
}
