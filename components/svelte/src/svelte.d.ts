import { SvelteComponent } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';

/**
 * Svelte component
 */
export default class Icon extends SvelteComponent<
	IconProps & SvelteHTMLElements['svg'] & Record<`data-${string}`, string>
> {}
