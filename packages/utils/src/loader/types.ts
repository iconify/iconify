import type { Awaitable } from '@antfu/utils';
import type { FullIconCustomisations } from '../customisations/defaults';
import type { IconifyJSON } from '@iconify/types';

/**
 * Type for universal icon loader.
 */
export type UniversalIconLoader = (
	collection: string,
	icon: string,
	options?: IconifyLoaderOptions
) => Promise<string | undefined>;

/**
 * Custom icon loader, used by `getCustomIcon`.
 */
export type CustomIconLoader = (name: string) => Awaitable<string | undefined>;

/**
 * Auto-install options
 */
export type AutoInstall =
	| boolean
	| ((name: string) => Promise<void | undefined>);

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
 * - apply `trimSVG` to the final `SVG` only when using custom icon collection and `trimCustomSvg` enabled
 */
export type IconCustomizations = {
	/**
	 * Transform raw `svg`.
	 *
	 * **WARNING**: `transform` will be only applied when using `custom` icon collection: it will be applied only when using `getCustomIcon` and excluded when using `searchForIcon`.
	 *
	 * @param svg The loaded `svg`
	 * @param collection The name of the collection
	 * @param icon The name of the icon
	 * @return The transformed `svg`.
	 */
	transform?: (
		svg: string,
		collection: string,
		icon: string
	) => Awaitable<string>;
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
	/**
	 * Should optimize the custom `svg` icon?.
	 *
	 * Enable this flag when using custom `SVG` on `CSS`.
	 *
	 * @default `false`.
	 */
	trimCustomSvg?: boolean;
};

/**
 * List of icons as object. Key is the icon name, the value is the icon data or callback (can be async) to get icon data
 */
export type InlineCollection = Record<
	string,
	string | (() => Awaitable<string | undefined>)
>;

/**
 * Collection of custom icons. Key is the collection name, the value is the loader or InlineCollection object
 */
export type CustomCollections = Record<
	string,
	CustomIconLoader | InlineCollection
>;

/**
 * Options to use with the modern loader.
 */
export type IconifyLoaderOptions = {
	/**
	 * Emit warning when missing icons are matched
	 */
	warn?: string;

	/**
	 * Add svg and xlink xml namespace when necessary.
	 *
	 * @default false
	 */
	addXmlNs?: boolean;

	/**
	 * Scale of icons against 1em
	 */
	scale?: number;

	/**
	 * Style to apply to icons by default
	 *
	 * @default ''
	 */
	defaultStyle?: string;

	/**
	 * Class names to apply to icons by default
	 *
	 * @default ''
	 */
	defaultClass?: string;

	/**
	 * Loader for custom loaders
	 */
	customCollections?: Record<
		string,
		| (() => Awaitable<IconifyJSON>)
		| undefined
		| CustomIconLoader
		| InlineCollection
	>;

	/**
	 * Icon customizer
	 */
	customizations?: IconCustomizations;

	/**
	 * Auto install icon sources package when the usages is detected
	 *
	 * **WARNING**: only on `node` environment, on `browser` this option will be ignored
	 *
	 * @default false
	 */
	autoInstall?: AutoInstall;

	/**
	 * The additional icon properties applied to the svg.
	 *
	 * The `width` and `height` will not be set to the `svg` if already present on it, and so, the `width` and `height` will be those you configure on the customizations.
	 * If you omit the `width/height/scale` options and the `svg` contains the `width` and/or `height`, then, both will be extracted from the `svg`.
	 *
	 * If you need that properties just add an empty object here, useful for example when using the `svg` on `CSS`.
	 */
	usedProps?: Record<string, string>;

	/**
	 * The scope of the icon sources package
	 *
	 * @default '@iconify-json'
	 */
	scope?: string;
};
