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

// Functions
// Important: duplicate of global exports in OfflineIcon.svelte. When changing exports, they must be changed in both files.
export { addIcon, addCollection } from './offline-functions';
