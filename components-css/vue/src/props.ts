import type { IconifyIcon } from '@iconify/types';

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
