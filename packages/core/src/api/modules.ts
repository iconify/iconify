import type { QueryModuleResponse } from '@iconify/api-redundancy';

/**
 * Params for sendQuery()
 */
export interface IconifyAPIIconsQueryParams {
	type: 'icons';
	provider: string;
	prefix: string;
	icons: string[];
}
export interface IconifyAPICustomQueryParams {
	type: 'custom';
	provider?: string; // Provider is optional. If missing, temporary config is created based on host
	uri: string;
}

export type IconifyAPIQueryParams =
	| IconifyAPIIconsQueryParams
	| IconifyAPICustomQueryParams;

/**
 * Functions to implement in module
 */
export type IconifyAPIPrepareIconsQuery = (
	provider: string,
	prefix: string,
	icons: string[]
) => IconifyAPIIconsQueryParams[];

export type IconifyAPISendQuery = (
	host: string,
	params: IconifyAPIQueryParams,
	callback: QueryModuleResponse
) => void;

/**
 * API modules
 */
export interface IconifyAPIModule {
	prepare: IconifyAPIPrepareIconsQuery;
	send: IconifyAPISendQuery;
}

/**
 * Local storate types and entries
 */
const storage = Object.create(null) as Record<string, IconifyAPIModule>;

/**
 * Set API module
 */
export function setAPIModule(provider: string, item: IconifyAPIModule): void {
	storage[provider] = item;
}

/**
 * Get API module
 */
export function getAPIModule(provider: string): IconifyAPIModule | undefined {
	return storage[provider] || storage[''];
}
