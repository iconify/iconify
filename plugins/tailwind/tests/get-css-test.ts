import { getCSSRules } from '../src/iconify';

describe('Testing CSS rules', () => {
	it('One icon', () => {
		const data = getCSSRules('mdi-light:home');
		expect(Object.keys(data)).toEqual([
			'.icon--mdi-light',
			'.icon--mdi-light--home',
		]);
		expect(Object.keys(data['.icon--mdi-light--home'])).toEqual(['--svg']);
	});

	it('Multiple icons from same icon set', () => {
		const data = getCSSRules([
			// By name
			'mdi-light:home',
			// By selector
			'.icon--mdi-light--arrow-left',
			'.icon--mdi-light.icon--mdi-light--arrow-down',
			// By class name
			'icon--mdi-light--file',
			'icon--mdi-light icon--mdi-light--format-clear',
		]);
		expect(Object.keys(data)).toEqual([
			'.icon--mdi-light',
			'.icon--mdi-light--home',
			'.icon--mdi-light--arrow-left',
			'.icon--mdi-light--arrow-down',
			'.icon--mdi-light--file',
			'.icon--mdi-light--format-clear',
		]);
	});

	it('Multiple icon sets', () => {
		const data = getCSSRules([
			// MDI Light
			'mdi-light:home',
			// Line MD
			'line-md:home',
		]);
		expect(Object.keys(data)).toEqual([
			'.icon--mdi-light',
			'.icon--mdi-light--home',
			'.icon--line-md',
			'.icon--line-md--home',
		]);
	});

	it('Bad class name', () => {
		let threw = false;
		try {
			getCSSRules(['icon--mdi-light--home test']);
		} catch {
			threw = true;
		}
		expect(threw).toBe(true);
	});

	it('Bad icon set', () => {
		let threw = false;
		try {
			getCSSRules('test123:home');
		} catch {
			threw = true;
		}
		expect(threw).toBe(true);
	});
});
