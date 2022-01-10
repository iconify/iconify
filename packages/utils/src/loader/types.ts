import type { Awaitable } from '@antfu/utils';
import type { FullIconCustomisations } from '../customisations';

/**
 * Custom icon loader, used by `getCustomIcon`.
 */
export type CustomIconLoader = (name: string) => Awaitable<string | undefined>;

/**
 * Custom icon customizer, it will allow to customize all icons on a collection or individual icons.
 */
export type IconCustomizer = (
	collection: string,
	icon: string,
	props: Record<string, string>
) => Awaitable<void>;

/**
 * Icon customizations: will be applied to all resolved icons.
 *
 * For each loaded icon, the customizations will be applied in this order:
 * - apply `transform` to raw `svg`, if provided and using custom icon collection
 * - apply `customize` with default customizations, if provided
 * - apply `iconCustomizer` with `customize` customizations, if provided
 * - apply `additionalProps` with `iconCustomizer` customizations, if provided
 */
export type IconCustomizations = {
	/**
	 * Transform raw `svg`.
	 *
	 * **WARNING**: `transform` will be only applied when using `custom` icon collection: it will be applied only when using `getCustomIcon` and excluded when using `searchForIcon`.
	 *
	 * @param svg The loaded `svg`
	 * @return The transformed `svg`.
	 */
	transform?: (svg: string) => Awaitable<string>;
	/**
	 * Change default icon customizations values.
	 *
	 * @param defaultCustomizations Default icon's customizations values.
	 * @return The modified icon's customizations values.
	 */
	customize?: (
		defaultCustomizations: FullIconCustomisations
	) => FullIconCustomisations;
	/**
	 * Custom icon customizer.
	 */
	iconCustomizer?: IconCustomizer;
	/**
	 * Additional icon properties.
	 *
	 * All properties without value will not be applied.
	 */
	additionalProps?: Record<string, string | undefined>;
};

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
