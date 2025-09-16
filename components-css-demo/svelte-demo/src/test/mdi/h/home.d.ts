import { SvelteComponent } from 'svelte';
import { SvelteHTMLElements } from 'svelte/elements';
import type {
	CSSIconComponentProps,
	CSSIconComponentViewbox,
} from '@iconify/css-svelte';

type IconComponentProps = Pick<CSSIconComponentProps, 'width' | 'height'>;

declare class Icon extends SvelteComponent<
	Omit<SvelteHTMLElements['svg'], 'viewBox'> &
		IconComponentProps &
		Record<`data-${string}`, string>
> {}

export { Icon as default };
