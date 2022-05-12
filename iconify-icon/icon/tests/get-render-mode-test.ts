import { getRenderMode } from '../src/attributes/mode';

describe('Testing getRenderMode', () => {
	// Default mode is 'svg'? Change this value if code in state/mode.ts changes
	const defautToSVG = true;

	it('Force mode', () => {
		expect(getRenderMode('<g />', 'svg')).toBe('svg');
		expect(getRenderMode('<g />', 'bg')).toBe('bg');
		expect(getRenderMode('<g />', 'mask')).toBe('mask');
	});

	it('Style', () => {
		expect(getRenderMode('<g />', 'style')).toBe('bg');
		expect(
			getRenderMode('<g><path d="" fill="currentColor" /></g>', 'style')
		).toBe('mask');
	});

	it('Detect mode', () => {
		// Icon without 'currentColor'
		expect(getRenderMode('<g />', null)).toBe(defautToSVG ? 'svg' : 'bg');
		expect(getRenderMode('<g />', '')).toBe(defautToSVG ? 'svg' : 'bg');

		// Icon with 'currentColor'
		expect(
			getRenderMode('<g><path d="" fill="currentColor" /></g>', '')
		).toBe(defautToSVG ? 'svg' : 'mask');
		expect(
			getRenderMode(
				'<g><path d="" fill="currentColor" /></g>',
				'whatever'
			)
		).toBe(defautToSVG ? 'svg' : 'mask');
	});

	it('Animated icons', () => {
		// Animated icon without 'currentColor'
		const animatedDefaultFill =
			'<g><rect width="20"><animate attributeName="height" values="0;10" dur="1s" fill="freeze" /></rect></g>';

		expect(getRenderMode(animatedDefaultFill, 'svg')).toBe('svg');
		expect(getRenderMode(animatedDefaultFill, 'bg')).toBe('bg');
		expect(getRenderMode(animatedDefaultFill, 'mask')).toBe('mask');

		expect(getRenderMode(animatedDefaultFill, '')).toBe('bg');
		expect(getRenderMode(animatedDefaultFill, 'style')).toBe('bg');

		// Animated icon with 'currentColor'
		const animatedCurrentColor =
			'<g><rect width="20" fill="currentColor"><animate attributeName="height" values="0;10" dur="1s" fill="freeze" /></rect></g>';

		expect(getRenderMode(animatedCurrentColor, 'svg')).toBe('svg');
		expect(getRenderMode(animatedCurrentColor, 'bg')).toBe('bg');
		expect(getRenderMode(animatedCurrentColor, 'mask')).toBe('mask');

		expect(getRenderMode(animatedCurrentColor, '')).toBe('mask');
		expect(getRenderMode(animatedCurrentColor, 'style')).toBe('mask');
	});
});
