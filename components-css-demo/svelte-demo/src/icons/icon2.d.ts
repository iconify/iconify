import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	action?: boolean;
	focus?: boolean;
	width?: string;
	height?: string;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<`data-${string}`, string>> {}

export { type IconProps };
export default Component;
