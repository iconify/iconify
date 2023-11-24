import { getDynamicCSSRules } from '../src/dynamic';

describe('Testing dynamic CSS rules', () => {
	it('One icon', () => {
		const data = getDynamicCSSRules('mdi-light--home');
		expect(typeof data['--svg']).toBe('string');
		expect(data).toEqual({
			'display': 'inline-block',
			'width': '1em',
			'height': '1em',
			'background-color': 'currentColor',
			'-webkit-mask-image': 'var(--svg)',
			'mask-image': 'var(--svg)',
			'-webkit-mask-repeat': 'no-repeat',
			'mask-repeat': 'no-repeat',
			'-webkit-mask-size': '100% 100%',
			'mask-size': '100% 100%',
			'--svg': data['--svg'],
		});
	});

	it('Only selectors that override icon', () => {
		const data = getDynamicCSSRules('mdi-light--home', {
			overrideOnly: true,
		});
		expect(typeof data['--svg']).toBe('string');
		expect(data).toEqual({
			'--svg': data['--svg'],
		});
	});

	it('Scale appropriate sets height/width default value', () => {
		const data = getDynamicCSSRules('mdi-light--home', {
			scale: 2,
		});
		expect(data).toEqual({
			'display': 'inline-block',
			'width': '2em',
			'height': '2em',
			'background-color': 'currentColor',
			'-webkit-mask-image': 'var(--svg)',
			'mask-image': 'var(--svg)',
			'-webkit-mask-repeat': 'no-repeat',
			'mask-repeat': 'no-repeat',
			'-webkit-mask-size': '100% 100%',
			'mask-size': '100% 100%',
			'--svg': data['--svg'],
		});
	});

	it('Scale removes default value', () => {
		const data = getDynamicCSSRules('mdi-light--home', {
			scale: 0,
		});
		expect(data).toEqual({
			'display': 'inline-block',
			'background-color': 'currentColor',
			'-webkit-mask-image': 'var(--svg)',
			'mask-image': 'var(--svg)',
			'-webkit-mask-repeat': 'no-repeat',
			'mask-repeat': 'no-repeat',
			'-webkit-mask-size': '100% 100%',
			'mask-size': '100% 100%',
			'--svg': data['--svg'],
		});
	});

	it('Missing icon', () => {
		let threw = false;
		try {
			getDynamicCSSRules('mdi-light--missing-icon-name');
		} catch {
			threw = true;
		}
		expect(threw).toBe(true);
	});

	it('Bad icon name', () => {
		let threw = false;
		try {
			getDynamicCSSRules('mdi-home');
		} catch {
			threw = true;
		}
		expect(threw).toBe(true);
	});

	it('Bad icon set', () => {
		let threw = false;
		try {
			getDynamicCSSRules('test123:home');
		} catch {
			threw = true;
		}
		expect(threw).toBe(true);
	});
});
