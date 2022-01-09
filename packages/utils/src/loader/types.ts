import type { Awaitable } from '@antfu/utils';

export type CustomIconLoader = (name: string) => Awaitable<string | undefined>;
export type InlineCollection = Record<
	string,
	string | (() => Awaitable<string | undefined>)
>;
export type CustomCollections = Record<
	string,
	CustomIconLoader | InlineCollection
>;
