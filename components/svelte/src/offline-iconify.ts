// Types
export type { IconifyJSON, IconifyIcon } from '@iconify/types';
export type { IconifyIconSize } from '@iconify/utils/lib/customisations/defaults';

// Types from props.ts
export type {
	IconifyIconCustomisations,
	IconProps,
	IconifyRenderMode,
} from './props';

// Functions
// Important: duplicate of global exports in OfflineIcon.svelte. When changing exports, they must be changed in both files.
export { addIcon, addCollection } from './offline-functions';
