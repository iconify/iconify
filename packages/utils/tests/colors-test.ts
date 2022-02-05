/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { stringToColor, compareColors, colorToString } from '../lib/colors';

describe('Colors', () => {
	test('Keywords', () => {
		// String to color
		expect(stringToColor('red')).toEqual({
			type: 'rgb',
			r: 255,
			g: 0,
			b: 0,
			alpha: 1,
		});
		expect(stringToColor('darkGray')).toEqual({
			type: 'rgb',
			r: 169,
			g: 169,
			b: 169,
			alpha: 1,
		});
		expect(stringToColor('purple')).toEqual({
			type: 'rgb',
			r: 128,
			g: 0,
			b: 128,
			alpha: 1,
		});

		// Special keywords
		expect(stringToColor('None')).toEqual({
			type: 'none',
		});
		expect(stringToColor('transparent')).toEqual({
			type: 'transparent',
		});
		expect(stringToColor('currentColor')).toEqual({
			type: 'current',
		});
		expect(stringToColor('inherit')).toBeNull();

		// Color to string
		expect(
			colorToString({
				type: 'rgb',
				r: 255,
				g: 0,
				b: 0,
				alpha: 1,
			})
		).toBe('#f00');
		expect(
			colorToString({
				type: 'rgb',
				r: 169,
				g: 169,
				b: 169,
				alpha: 1,
			})
		).toBe('#a9a9a9');
		expect(
			colorToString({
				type: 'rgb',
				r: 128,
				g: 0,
				b: 128,
				alpha: 1,
			})
		).toBe('#800080');

		// Keywords
		expect(
			colorToString({
				type: 'none',
			})
		).toBe('none');
		expect(
			colorToString({
				type: 'current',
			})
		).toBe('currentColor');

		expect(
			colorToString({
				type: 'transparent',
			})
		).toBe('transparent');

		// Transparent
		expect(
			colorToString({
				type: 'rgb',
				r: 255,
				g: 255,
				b: 0,
				alpha: 0,
			})
		).toBe('transparent');

		// Function
		expect(
			colorToString({
				type: 'function',
				func: 'var',
				value: '--foo',
			})
		).toBe('var(--foo)');
	});

	test('Hexadecimal', () => {
		// 2 characters
		expect(stringToColor('12')).toBeNull();

		// 3 characters
		expect(stringToColor('1a3')).toEqual({
			type: 'rgb',
			r: 17,
			g: 170,
			b: 51,
			alpha: 1,
		});
		expect(
			colorToString({
				type: 'rgb',
				r: 17,
				g: 170,
				b: 51,
				alpha: 1,
			})
		).toBe('#1a3');

		expect(stringToColor('g12')).toBeNull();

		// 4 characters
		expect(stringToColor('#1a3')).toEqual({
			type: 'rgb',
			r: 17,
			g: 170,
			b: 51,
			alpha: 1,
		});
		expect(stringToColor('F123')).toEqual({
			type: 'rgb',
			r: 255,
			g: 17,
			b: 34,
			alpha: 51 / 255,
		});
		expect(stringToColor('-123')).toBeNull();
		expect(stringToColor('#zx2')).toBeNull();

		// 5 characters
		expect(stringToColor('12345')).toBeNull();

		// 6 characters
		expect(stringToColor('1234F6')).toEqual({
			type: 'rgb',
			r: 18,
			g: 52,
			b: 246,
			alpha: 1,
		});
		expect(
			colorToString({
				type: 'rgb',
				r: 18,
				g: 52,
				b: 246,
				alpha: 1,
			})
		).toBe('#1234f6');

		// 7 characters
		expect(stringToColor('#11Aa33')).toEqual({
			type: 'rgb',
			r: 17,
			g: 170,
			b: 51,
			alpha: 1,
		});
		expect(
			colorToString({
				type: 'rgb',
				r: 17,
				g: 170,
				b: 51,
				alpha: 1,
			})
		).toBe('#1a3');

		expect(stringToColor('1234567')).toBeNull();

		// 8 characters
		expect(stringToColor('a51234f6')).toEqual({
			type: 'rgb',
			r: 165,
			g: 18,
			b: 52,
			alpha: 246 / 255,
		});
		expect(
			colorToString({
				type: 'rgb',
				r: 165,
				g: 18,
				b: 52,
				alpha: 0.96,
			})
		).toBe('rgba(165, 18, 52, 0.96)');

		// 9 characters
		expect(stringToColor('#a51234f6')).toEqual({
			type: 'rgb',
			r: 165,
			g: 18,
			b: 52,
			alpha: 246 / 255,
		});
		expect(stringToColor('123456789')).toBeNull();

		// 10 characters
		expect(stringToColor('1234567890')).toBeNull();
	});

	test('RGB', () => {
		// Missing ')'
		expect(stringToColor('rgb(0, 0, 0, 1')).toBeNull();

		// Variable
		expect(stringToColor('rgb(var(--foo), 0, 0, 1)')).toBeNull();

		// Incorrect or missing '%'
		expect(stringToColor('rgb(0%, 0, 0)')).toBeNull();
		expect(stringToColor('rgb(0%, 0, 0%)')).toBeNull();
		expect(stringToColor('rgb(0, 0%, 0%)')).toBeNull();
		expect(stringToColor('rgb(0, 0, 0%)')).toBeNull();

		// Simple rgb
		expect(stringToColor('rgb(10, 20, 30)')).toEqual({
			type: 'rgb',
			r: 10,
			g: 20,
			b: 30,
			alpha: 1,
		});
		expect(stringToColor('rgb(10 20 30)')).toEqual({
			type: 'rgb',
			r: 10,
			g: 20,
			b: 30,
			alpha: 1,
		});
		expect(
			colorToString({
				type: 'rgb',
				r: 10,
				g: 20,
				b: 30,
				alpha: 1,
			})
		).toBe('#0a141e');

		expect(stringToColor('rgba(12.5, 20, 30)')).toEqual({
			type: 'rgb',
			r: 12.5,
			g: 20,
			b: 30,
			alpha: 1,
		});
		expect(
			colorToString({
				type: 'rgb',
				r: 12.5,
				g: 20,
				b: 30,
				alpha: 1,
			})
		).toBe('rgb(12.5, 20, 30)');

		// Incorrect keyword, but accepted anyway
		expect(stringToColor('rgb(10, 25, 30, .5)')).toEqual({
			type: 'rgb',
			r: 10,
			g: 25,
			b: 30,
			alpha: 0.5,
		});
		expect(
			colorToString({
				type: 'rgb',
				r: 10,
				g: 25,
				b: 30,
				alpha: 0.5,
			})
		).toBe('rgba(10, 25, 30, 0.5)');

		// Percentage in color
		expect(stringToColor('rgba(100%, 50%, 20%)')).toEqual({
			type: 'rgb',
			r: 255,
			g: 127.5,
			b: 51,
			alpha: 1,
		});

		// Percentage in alpha
		expect(stringToColor('rgba(10, 20, 31, 50%)')).toEqual({
			type: 'rgb',
			r: 10,
			g: 20,
			b: 31,
			alpha: 0.5,
		});
	});

	test('HSL', () => {
		// Too many parts
		expect(stringToColor('hsl(0, 0, 0, 1, 2)')).toBeNull();

		// Incorrect or missing '%'
		expect(stringToColor('hsl(0%, 0%, 0%, 1)')).toBeNull();
		expect(stringToColor('hsl(0%, 0, 0%, 1)')).toBeNull();
		expect(stringToColor('hsl(0%, 0%, 0)')).toBeNull();
		expect(stringToColor('hsl(0, 0%, 0)')).toBeNull();
		expect(stringToColor('hsl(0, 0, 0%)')).toBeNull();
		expect(stringToColor('hsl(0, 0, 0, 50%)')).toBeNull();

		// Simple hsl
		expect(stringToColor('hsl(10, 20%, 30%)')).toEqual({
			type: 'hsl',
			h: 10,
			s: 20,
			l: 30,
			alpha: 1,
		});
		expect(stringToColor('hsl(11 22%   33%)')).toEqual({
			type: 'hsl',
			h: 11,
			s: 22,
			l: 33,
			alpha: 1,
		});
		expect(
			colorToString({
				type: 'hsl',
				h: 10,
				s: 20,
				l: 30,
				alpha: 1,
			})
		).toBe('hsl(10, 20%, 30%)');

		expect(stringToColor('hsla(90, 20%, 30%)')).toEqual({
			type: 'hsl',
			h: 90,
			s: 20,
			l: 30,
			alpha: 1,
		});

		// Weird formatting
		expect(stringToColor('HSLA ( 10 , 20% , 30% , .2 )')).toEqual({
			type: 'hsl',
			h: 10,
			s: 20,
			l: 30,
			alpha: 0.2,
		});
		expect(
			colorToString({
				type: 'hsl',
				h: 10,
				s: 20,
				l: 30,
				alpha: 0.2,
			})
		).toBe('hsla(10, 20%, 30%, 0.2)');

		// Floating numbers, percentage in alpha
		expect(stringToColor('hsl(10.4, 20.7%, 30.1%, 84.5%)')).toEqual({
			type: 'hsl',
			h: 10.4,
			s: 20.7,
			l: 30.1,
			alpha: 0.845,
		});
		expect(
			colorToString({
				type: 'hsl',
				h: 10.4,
				s: 20.7,
				l: 30.1,
				alpha: 0.845,
			})
		).toBe('hsla(10.4, 20.7%, 30.1%, 0.845)');
	});

	test('LAB', () => {
		// Too many parts
		expect(stringToColor('lab(10% 20 30 0.5)')).toBeNull();

		// Incorrect or missing '%'
		expect(stringToColor('lab(10%, 20%, 30%)')).toBeNull();
		expect(stringToColor('lab(10%, 20, 30%)')).toBeNull();
		expect(stringToColor('lab(10%, 20%, 30)')).toBeNull();
		expect(stringToColor('lab(10, 20, 30)')).toBeNull();

		// Simple lab
		expect(stringToColor('lab(10%, 20, 30)')).toEqual({
			type: 'lab',
			l: 10,
			a: 20,
			b: 30,
			alpha: 1,
		});
		expect(stringToColor('lab(11% 22 33 / 1)')).toEqual({
			type: 'lab',
			l: 11,
			a: 22,
			b: 33,
			alpha: 1,
		});
		expect(
			colorToString({
				type: 'lab',
				l: 10,
				a: 20,
				b: 30,
				alpha: 1,
			})
		).toBe('lab(10% 20 30)');

		// Floating numbers, percentage in alpha, commas
		expect(stringToColor('lab(10.4%, 20.7, 30.1 / 84.5%)')).toEqual({
			type: 'lab',
			l: 10.4,
			a: 20.7,
			b: 30.1,
			alpha: 0.845,
		});
		expect(
			colorToString({
				type: 'lab',
				l: 10.4,
				a: 20.7,
				b: 30.1,
				alpha: 0.845,
			})
		).toBe('lab(10.4% 20.7 30.1 / 0.845)');
	});

	test('LCH', () => {
		// Too many parts
		expect(stringToColor('lch(10% 20 30 0.5)')).toBeNull();

		// Incorrect or missing '%'
		expect(stringToColor('lch(10%, 20%, 30%)')).toBeNull();
		expect(stringToColor('lch(10%, 20, 30%)')).toBeNull();
		expect(stringToColor('lch(10%, 20%, 30)')).toBeNull();
		expect(stringToColor('lch(10, 20, 30)')).toBeNull();

		// Simple lch
		expect(stringToColor('lch(10%, 20, 30)')).toEqual({
			type: 'lch',
			l: 10,
			c: 20,
			h: 30,
			alpha: 1,
		});
		expect(stringToColor('lch(11% 22 33 / 1)')).toEqual({
			type: 'lch',
			l: 11,
			c: 22,
			h: 33,
			alpha: 1,
		});
		expect(
			colorToString({
				type: 'lch',
				l: 10,
				c: 20,
				h: 30,
				alpha: 1,
			})
		).toBe('lch(10% 20 30)');

		// Floating numbers, percentage in alpha, commas
		expect(stringToColor('lch(10.4%, 20.7, 30.1 / 84.5%)')).toEqual({
			type: 'lch',
			l: 10.4,
			c: 20.7,
			h: 30.1,
			alpha: 0.845,
		});
		expect(
			colorToString({
				type: 'lch',
				l: 10.4,
				c: 20.7,
				h: 30.1,
				alpha: 0.845,
			})
		).toBe('lch(10.4% 20.7 30.1 / 0.845)');
	});

	test('Functions', () => {
		// Missing ')'
		expect(stringToColor('var(--foo')).toBeNull();

		// Valid functions
		expect(stringToColor('var(--foo)')).toEqual({
			type: 'function',
			func: 'var',
			value: '--foo',
		});
		expect(stringToColor('url(#a)')).toEqual({
			type: 'function',
			func: 'url',
			value: '#a',
		});
	});

	test('Compare colors', () => {
		// Identical items
		expect(
			compareColors(
				stringToColor('var(--foo)')!,
				stringToColor('var(--foo)')!
			)
		).toBe(true);

		// Black colors
		expect(
			compareColors(
				stringToColor('rgb(0, 0, 0, 1)')!,
				stringToColor('#000')!
			)
		).toBe(true);

		expect(
			compareColors(
				stringToColor('rgb(0, 0, 0, 1)')!,
				stringToColor('hsl(100, 0%, 0%)')!
			)
		).toBe(true);

		// Transparent
		expect(
			compareColors(
				stringToColor('rgb(0, 255, 0, 0)')!,
				stringToColor('hsl(100, 0%, 0%, 0)')!
			)
		).toBe(true);
		expect(
			compareColors(
				stringToColor('transparent')!,
				stringToColor('hsl(80, 20%, 50%, 0)')!
			)
		).toBe(true);
		expect(
			compareColors(
				stringToColor('transparent')!,
				stringToColor('#f8a0')!
			)
		).toBe(true);

		// Mismatch
		expect(
			compareColors(
				stringToColor('transparent')!,
				stringToColor('hsl(100, 0%, 0%, .1)')!
			)
		).toBe(false);
	});
});
