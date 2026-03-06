import { JSX } from 'solid-js';

interface IconProps {
	halign?: 'left' | 'center' | 'right';
	valign?: 'top' | 'middle' | 'bottom' | 'stretch';
	focus?: boolean;
	width?: string;
	height?: string;
}

declare const Component: (
	props: Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
) => JSX.Element;

export { type IconProps };
export default Component;
