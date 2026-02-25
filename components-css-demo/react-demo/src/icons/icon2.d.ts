import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	action?: boolean;
	focus?: boolean;
	width?: string;
	height?: string;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

export { type IconProps };
export default Component;
