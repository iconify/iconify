// Types
export type { IconifyJSON } from '@iconify/types';
export type { IconifyIcon } from '@iconify/core/lib/icon';
export type {
	IconifyIconSize,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
} from '@iconify/core/lib/customisations';

// Types from props.ts
export type { IconifyIconCustomisations, IconProps } from './props';

// Component
export { default as Icon } from './Icon.svelte';

// Functions
export { enableCache, disableCache } from './functions';

export {
	iconExists,
	getIcon,
	listIcons,
	addIcon,
	addCollection,
} from './functions';

export { calculateSize, replaceIDs, buildIcon } from './functions';

export { loadIcons, addAPIProvider, _api } from './functions';
