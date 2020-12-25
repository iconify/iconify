import type { PendingQueryItem } from '@cyberalien/redundancy';
import type { GetAPIConfig } from '../api/config';

/**
 * Params for sendQuery()
 */
export interface APIQueryParams {
	provider: string;
	prefix: string;
	icons: string[];
}

/**
 * Functions to implement in module
 */
export type IconifyAPIPrepareQuery = (
	provider: string,
	prefix: string,
	icons: string[]
) => APIQueryParams[];

export type IconifyAPISendQuery = (
	host: string,
	params: APIQueryParams,
	status: PendingQueryItem
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
const storage: Record<string, IconifyAPIModule> = Object.create(null);

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
	return storage[provider] === void 0 ? storage[''] : storage[provider];
}

/**
 * Function to return API interface
 */
export type GetIconifyAPIModule = (
	getAPIConfig: GetAPIConfig
) => IconifyAPIModule;
