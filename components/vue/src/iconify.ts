import {
	defineComponent,
	onMounted,
	onUnmounted,
	ref,
	shallowRef,
	nextTick,
	watch,
} from 'vue';
import type { IconifyJSON, IconifyIcon } from '@iconify/types';

// Core
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import { stringToIcon } from '@iconify/utils/lib/icon/name';
import type { IconifyIconSize } from '@iconify/utils/lib/customisations/defaults';
import type { IconifyStorageFunctions } from '@iconify/core/lib/storage/functions';
import {
	iconLoaded,
	getIcon,
	addIcon,
	addCollection,
	getIconData,
	allowSimpleNames,
} from '@iconify/core/lib/storage/functions';
import { listIcons } from '@iconify/core/lib/storage/storage';
import type { IconifyBuilderFunctions } from '@iconify/core/lib/builder/functions';
import { iconToSVG as buildIcon } from '@iconify/utils/lib/svg/build';
import { replaceIDs } from '@iconify/utils/lib/svg/id';
import { calculateSize } from '@iconify/utils/lib/svg/size';
import type { IconifyIconBuildResult } from '@iconify/utils/lib/svg/build';
import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';

// API
import type {
	IconifyCustomIconLoader,
	IconifyCustomIconsLoader,
} from '@iconify/core/lib/api/types';
import type {
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
	IconifyAPIQueryParams,
	IconifyAPICustomQueryParams,
} from '@iconify/core/lib/api/functions';
import type {
	IconifyAPIModule,
	IconifyAPISendQuery,
	IconifyAPIPrepareIconsQuery,
} from '@iconify/core/lib/api/modules';
import { setAPIModule } from '@iconify/core/lib/api/modules';
import type {
	PartialIconifyAPIConfig,
	IconifyAPIConfig,
	GetAPIConfig,
} from '@iconify/core/lib/api/config';
import {
	addAPIProvider,
	getAPIConfig,
	listAPIProviders,
} from '@iconify/core/lib/api/config';
import {
	fetchAPIModule,
	setFetch,
	getFetch,
} from '@iconify/core/lib/api/modules/fetch';
import type {
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
} from '@iconify/core/lib/api/icons';
import { loadIcons, loadIcon } from '@iconify/core/lib/api/icons';
import {
	setCustomIconLoader,
	setCustomIconsLoader,
} from '@iconify/core/lib/api/loaders';
import { sendAPIQuery } from '@iconify/core/lib/api/query';

// Properties
import type {
	IconProps,
	IconifyIconCustomisations,
	IconifyIconProps,
	IconifyRenderMode,
	IconifyIconCustomiseCallback,
} from './props';

// Render SVG
import { render } from './render';

/**
 * Export required types
 */
// Function sets
export {
	IconifyStorageFunctions,
	IconifyBuilderFunctions,
	IconifyAPIFunctions,
	IconifyAPIInternalFunctions,
};

// JSON stuff
export { IconifyIcon, IconifyJSON, IconifyIconName };

// Customisations and icon props
export {
	IconifyIconCustomisations,
	IconifyIconSize,
	IconifyRenderMode,
	IconifyIconProps,
	IconProps,
};

// API
export {
	IconifyAPIConfig,
	IconifyIconLoaderCallback,
	IconifyIconLoaderAbort,
	IconifyAPIModule,
	GetAPIConfig,
	IconifyAPIPrepareIconsQuery,
	IconifyAPISendQuery,
	PartialIconifyAPIConfig,
	IconifyAPIQueryParams,
	IconifyAPICustomQueryParams,
	IconifyCustomIconLoader,
	IconifyCustomIconsLoader,
};

// Builder functions
export { IconifyIconBuildResult };

/**
 * Initialise stuff
 */
// Enable short names
allowSimpleNames(true);

// Set API module
setAPIModule('', fetchAPIModule);

/**
 * Browser stuff
 */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	interface WindowWithIconifyStuff {
		IconifyPreload?: IconifyJSON[] | IconifyJSON;
		IconifyProviders?: Record<string, PartialIconifyAPIConfig>;
	}
	const _window = window as WindowWithIconifyStuff;

	// Load icons from global "IconifyPreload"
	if (_window.IconifyPreload !== void 0) {
		const preload = _window.IconifyPreload;
		const err = 'Invalid IconifyPreload syntax.';
		if (typeof preload === 'object' && preload !== null) {
			(preload instanceof Array ? preload : [preload]).forEach((item) => {
				try {
					if (
						// Check if item is an object and not null/array
						typeof item !== 'object' ||
						item === null ||
						item instanceof Array ||
						// Check for 'icons' and 'prefix'
						typeof item.icons !== 'object' ||
						typeof item.prefix !== 'string' ||
						// Add icon set
						!addCollection(item)
					) {
						console.error(err);
					}
				} catch (e) {
					console.error(err);
				}
			});
		}
	}

	// Set API from global "IconifyProviders"
	if (_window.IconifyProviders !== void 0) {
		const providers = _window.IconifyProviders;
		if (typeof providers === 'object' && providers !== null) {
			for (let key in providers) {
				const err = 'IconifyProviders[' + key + '] is invalid.';
				try {
					const value = providers[key];
					if (
						typeof value !== 'object' ||
						!value ||
						value.resources === void 0
					) {
						continue;
					}
					if (!addAPIProvider(key, value)) {
						console.error(err);
					}
				} catch (e) {
					console.error(err);
				}
			}
		}
	}
}

/**
 * Empty icon data, rendered when icon is not available
 */
const emptyIcon = {
	...defaultIconProps,
	body: '',
};

/**
 * Component
 */
export const Icon = defineComponent<IconProps>(
	(props: IconProps, { emit }) => {
		// Loader
		interface LoaderState {
			name: string;
			abort?: () => void;
		}
		const loader = ref<LoaderState | null>(null);

		function abortLoading() {
			if (loader.value) {
				loader.value.abort?.();
				loader.value = null;
			}
		}

		// Render state
		const rendering = ref(!!props.ssr);
		const lastRenderedIconName = ref('');

		// Icon data
		interface IconComponentData {
			data: IconifyIcon;
			classes?: string[];
		}
		const iconData = shallowRef<IconComponentData | null>(null);

		// Update icon data
		function getIcon(): IconComponentData | null {
			const icon = props.icon;

			// Icon is an object
			if (
				typeof icon === 'object' &&
				icon !== null &&
				typeof icon.body === 'string'
			) {
				lastRenderedIconName.value = '';
				return {
					data: icon,
				};
			}

			// Check for valid icon name
			let iconName: IconifyIconName | null;
			if (
				typeof icon !== 'string' ||
				(iconName = stringToIcon(icon, false, true)) === null
			) {
				return null;
			}

			// Load icon
			let data = getIconData(iconName);
			if (!data) {
				// Icon data is not available
				const oldState = loader.value;
				if (!oldState || oldState.name !== icon) {
					// Icon name does not match old loader state
					if (data === null) {
						// Failed to load
						loader.value = {
							name: icon,
						};
					} else {
						loader.value = {
							name: icon,
							abort: loadIcons([iconName], updateIconData),
						};
					}
				}
				return null;
			}

			// Icon data is available
			abortLoading();
			if (lastRenderedIconName.value !== icon) {
				lastRenderedIconName.value = icon;
				// Emit on next tick because render will be called on next tick
				nextTick(() => {
					emit('load', icon);
				});
			}

			// Customise icon
			const customise = props.customise;
			if (customise) {
				// Clone data and customise it
				data = Object.assign({}, data);
				const customised = customise(
					data.body,
					iconName.name,
					iconName.prefix,
					iconName.provider
				);
				if (typeof customised === 'string') {
					data.body = customised;
				}
			}

			// Add classes
			const classes: string[] = ['iconify'];
			if (iconName.prefix !== '') {
				classes.push('iconify--' + iconName.prefix);
			}
			if (iconName.provider !== '') {
				classes.push('iconify--' + iconName.provider);
			}

			return { data, classes };
		}

		function updateIconData() {
			const icon = getIcon();
			if (!icon) {
				iconData.value = null;
			} else if (icon.data !== iconData.value?.data) {
				iconData.value = icon;
			}
		}

		// Set icon data
		if (rendering.value) {
			updateIconData();
		} else {
			onMounted(() => {
				rendering.value = true;
				updateIconData();
			});
		}
		watch(() => props.icon, updateIconData);

		// Abort loading on unmount
		onUnmounted(abortLoading);

		// Render function
		return () => {
			// Get icon data
			const icon = iconData.value;

			if (!icon) {
				// Icon is not available
				return render(emptyIcon, props);
			}

			// Add classes
			let newProps = props as IconifyIconProps & { class?: string };
			if (icon.classes) {
				newProps = {
					...props,
					class: icon.classes.join(' '),
				};
			}

			// Render icon
			return render(
				{
					...defaultIconProps,
					...icon.data,
				},
				newProps
			);
		};
	},
	{
		props: [
			// Icon and render mode
			'icon',
			'mode',
			'ssr',
			// Layout and style
			'width',
			'height',
			'style',
			'color',
			'inline',
			// Transformations
			'rotate',
			'hFlip',
			'horizontalFlip',
			'vFlip',
			'verticalFlip',
			'flip',
			// Misc
			'id',
			'ariaHidden',
			'customise',
			'title',
		],
		emits: ['load'],
	}
);

/**
 * Internal API
 */
const _api: IconifyAPIInternalFunctions = {
	getAPIConfig,
	setAPIModule,
	sendAPIQuery,
	setFetch,
	getFetch,
	listAPIProviders,
};

/**
 * Export functions
 */
// IconifyAPIInternalFunctions
export { _api };

// IconifyAPIFunctions
export {
	addAPIProvider,
	loadIcons,
	loadIcon,
	setCustomIconLoader,
	setCustomIconsLoader,
};

// IconifyStorageFunctions
export {
	iconLoaded,
	iconLoaded as iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
};

// IconifyBuilderFunctions
export { replaceIDs, calculateSize, buildIcon };
