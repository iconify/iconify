import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	halign?: 'left' | 'center' | 'right';
	valign?: 'top' | 'middle' | 'bottom' | 'stretch';
	focus?: boolean;
	width?: string;
	height?: string;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

export { type IconProps };
export default Component;
