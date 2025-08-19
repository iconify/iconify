/**
 * Provider specific data mixin: [prefix] = T
 */
export type ProviderData<T> = Record<string, T>;

/**
 * Icons data mixin: [provider][prefix] = T
 */
export type IconsData<T> = Record<string, ProviderData<T>>;
