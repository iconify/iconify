import type { IconifyIcon } from '@iconify/types';
import type { SVGProps } from 'react';

export interface CSSIconComponentViewbox {
	left?: number;
	top?: number;
	width: number;
	height: number;
}

export interface CSSIconComponentProps {
	// Size
	width?: string;
	height?: string;

	// viewBox
	viewBox: CSSIconComponentViewbox;

	// Raw content to render if browser supports SVG+CSS
	content?: string | IconifyIcon;

	// Fallback icon name
	fallback?: string | IconifyIcon;
}

// SVG properties
export interface CSSIconElementProps
	extends CSSIconComponentProps,
		Omit<
			SVGProps<SVGSVGElement>,
			'viewBox' | 'width' | 'height' | 'xmlns'
		> {
	//
}
