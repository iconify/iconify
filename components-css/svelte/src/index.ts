import { SvelteComponent } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type {
	CSSIconComponentProps,
	CSSIconComponentViewbox,
} from './props.js';

/**
 * Svelte component
 */
export default class Icon extends SvelteComponent<
	Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> &
		CSSIconComponentProps &
		Record<`data-${string}`, string>
> {}

/**
 * Types
 */
export {
	type CSSIconComponentProps,
	type CSSIconComponentViewbox,
	type IconifyIconName,
};
