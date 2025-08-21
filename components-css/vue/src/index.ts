import './init.js';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type {
	CSSIconComponentProps,
	CSSIconComponentViewbox,
} from './types.js';
import { Icon } from './component.js';
import { preloadIcons } from './preload.js';

export { Icon, preloadIcons };
export type { CSSIconComponentProps, CSSIconComponentViewbox, IconifyIconName };
