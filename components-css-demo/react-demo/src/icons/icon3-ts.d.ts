import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	mode?: 'auto' | 'light' | 'dark';
	fill?: 'no-fill' | 'light-filled' | 'dark-filled' | 'filled';
	focus?: boolean;
	width?: string;
	height?: string;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

export { type IconProps };
export default Component;
