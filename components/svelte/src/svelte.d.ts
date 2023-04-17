import { SvelteComponentTyped } from 'svelte';
import { HTMLAttributes } from 'svelte/elements';

/**
 * Svelte component
 */
export default class Icon extends SvelteComponentTyped<
	IconProps & HTMLAttributes<SVGSVGElement>
> {}
