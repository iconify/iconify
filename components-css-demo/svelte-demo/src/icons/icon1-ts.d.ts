import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	halign?: 'left' | 'center' | 'right';
	valign?: 'top' | 'middle' | 'bottom' | 'stretch';
	focus?: boolean;
	width?: string;
	height?: string;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<`data-${string}`, string>> {}

export { type IconProps };
export default Component;
