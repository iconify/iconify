import { RedundancyPendingItem } from '@cyberalien/redundancy';

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
interface ModulesStorage {
	default?: IconifyAPIModule;
	providers: Record<string, IconifyAPIModule>;
}
const storage: ModulesStorage = {
	providers: Object.create(null),
};

/**
 * Set default API module
 */
export function setDefaultAPIModule(item: IconifyAPIModule): void {
	storage.default = item;
}

/**
 * Set API module
 */
export function setProviderAPIModule(
	provider: string,
	item: IconifyAPIModule
): void {
	storage.providers[provider] = item;
}

/**
 * Get API module
 */
export function getAPIModule(provider: string): IconifyAPIModule | undefined {
	return storage.providers[provider] === void 0
		? storage.default
		: storage.providers[provider];
}
