import { SvelteComponent } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';

/**
 * Svelte component
 */
export default class Icon extends SvelteComponent<
	SvelteHTMLElements['svg'] & IconProps & Record<`data-${string}`, string>
> {}
