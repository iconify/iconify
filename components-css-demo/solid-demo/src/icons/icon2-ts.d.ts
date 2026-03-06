import { JSX } from 'solid-js';

interface IconProps {
	action?: boolean;
	focus?: boolean;
	width?: string;
	height?: string;
}

declare const Component: (
	props: Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
) => JSX.Element;

export { type IconProps };
export default Component;
