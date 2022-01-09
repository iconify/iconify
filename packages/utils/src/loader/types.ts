import type { Awaitable } from '@antfu/utils';

/**
 * Custom icon loader, used by getCustomIcon()
 */
export type CustomIconLoader = (name: string) => Awaitable<string | undefined>;

/**
 * List of icons as object. Key is icon name, value is icon data or callback (can be async) to get icon data
 */
export type InlineCollection = Record<
	string,
	string | (() => Awaitable<string | undefined>)
>;

/**
 * Collection of custom icons. Key is collection name, value is loader or InlineCollection object
 */
export type CustomCollections = Record<
	string,
	CustomIconLoader | InlineCollection
>;
