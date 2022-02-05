export interface RGBColor {
	type: 'rgb';
	r: number;
	g: number;
	b: number;
	alpha: number;
}

export interface HSLColor {
	type: 'hsl';
	h: number;
	s: number;
	l: number;
	alpha: number;
}

export interface LABColor {
	type: 'lab';
	l: number;
	a: number;
	b: number;
	alpha: number;
}

export interface LCHColor {
	type: 'lch';
	l: number;
	c: number;
	h: number;
	alpha: number;
}

export interface FunctionColor {
	type: 'function';
	func: string;
	value: string;
}

export interface TransparentColor {
	type: 'transparent';
}

export interface NoColor {
	type: 'none';
}

export interface CurrentColor {
	type: 'current';
}

export type Color =
	| RGBColor
	| HSLColor
	| LABColor
	| LCHColor
	| FunctionColor
	| TransparentColor
	| NoColor
	| CurrentColor;
