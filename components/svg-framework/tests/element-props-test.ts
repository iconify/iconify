import { cleanupGlobals, setupDOM } from './helpers';
import { getElementProps } from '../src/scanner/get-props';
import { propsChanged } from '../src/scanner/compare';
import { defaults } from '@iconify/utils/lib/customisations';

describe('Testing element properties', () => {
	beforeEach(() => {
		setupDOM('');
	});

	afterEach(cleanupGlobals);

	it('Icon name', () => {
		const element = document.createElement('span');
		expect(getElementProps(element)).toBeNull();

		// Set name
		element.setAttribute('data-icon', 'mdi:home');
		const props1 = getElementProps(element);
		expect(props1).toEqual({
			name: 'mdi:home',
			icon: {
				provider: '',
				prefix: 'mdi',
				name: 'home',
			},
			customisations: {
				...defaults,
			},
			// Value is null because that is what getAttribute() returns, but type and value are not
			// checked because it does not actually matter. In render it compares to string, any other
			// value is considered to be automatic mode
			mode: null,
		});

		// More complex name
		element.setAttribute('data-icon', '@custom-api:icon-prefix:icon-name');
		const props2 = getElementProps(element);
		expect(props2).toEqual({
			name: '@custom-api:icon-prefix:icon-name',
			icon: {
				provider: 'custom-api',
				prefix: 'icon-prefix',
				name: 'icon-name',
			},
			customisations: {
				...defaults,
			},
			mode: null,
		});
		expect(propsChanged(props1, props2)).toBe(true);

		// Short name
		element.setAttribute('data-icon', 'mdi-home');
		const props3 = getElementProps(element);
		expect(props3).toEqual({
			name: 'mdi-home',
			icon: {
				provider: '',
				prefix: 'mdi',
				name: 'home',
			},
			customisations: {
				...defaults,
			},
			mode: null,
		});
		expect(propsChanged(props1, props3)).toBe(true);
		expect(propsChanged(props2, props3)).toBe(true);

		// Invalid name
		element.setAttribute('data-icon', 'home');
		expect(getElementProps(element)).toBeNull();
	});

	it('Inline icon', () => {
		const element = document.createElement('span');

		// Set icon name
		const name = 'mdi:home';
		const icon = {
			provider: '',
			prefix: 'mdi',
			name: 'home',
		};
		element.setAttribute('data-icon', name);

		// Block: default
		const props1Block = getElementProps(element);
		expect(props1Block).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				inline: false,
			},
			mode: null,
		});

		// Inline: set via attribute
		element.setAttribute('data-inline', 'true');
		const props2Inline = getElementProps(element);
		expect(props2Inline).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				inline: true,
			},
			mode: null,
		});
		expect(propsChanged(props1Block, props2Inline)).toBe(true);

		// Block: set via attribute
		element.setAttribute('data-inline', 'false');
		const props3Block = getElementProps(element);
		expect(props3Block).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				inline: false,
			},
			mode: null,
		});
		expect(propsChanged(props1Block, props3Block)).toBe(false);

		// Inline: set via class
		element.removeAttribute('data-inline');
		element.className = 'iconify-inline';
		const props4Inline = getElementProps(element);
		expect(props4Inline).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				inline: true,
			},
			mode: null,
		});
		expect(propsChanged(props1Block, props4Inline)).toBe(true);
		expect(propsChanged(props2Inline, props4Inline)).toBe(false);

		// Block: set via class
		element.className = 'iconify';
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				inline: false,
			},
			mode: null,
		});

		// Inline: set via attribute, overriding class
		element.className = 'iconify';
		element.setAttribute('data-inline', 'true');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				inline: true,
			},
			mode: null,
		});

		// Block: set via attribute, overriding class
		element.className = 'iconify-inline';
		element.setAttribute('data-inline', 'false');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				inline: false,
			},
			mode: null,
		});
	});

	it('Dimensions', () => {
		const element = document.createElement('span');

		// Set icon name
		const name = 'mdi:home';
		const icon = {
			provider: '',
			prefix: 'mdi',
			name: 'home',
		};
		element.setAttribute('data-icon', name);

		// Default
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				width: null,
				height: null,
			},
			mode: null,
		});

		// Set width
		element.setAttribute('data-width', '200');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				width: '200',
				height: null,
			},
			mode: null,
		});

		// Set height
		element.setAttribute('data-height', '1em');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				width: '200',
				height: '1em',
			},
			mode: null,
		});

		// Empty width
		element.setAttribute('data-width', '');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				width: null,
				height: '1em',
			},
			mode: null,
		});
	});

	it('Rotation', () => {
		const element = document.createElement('span');

		// Set icon name
		const name = 'mdi:home';
		const icon = {
			provider: '',
			prefix: 'mdi',
			name: 'home',
		};
		element.setAttribute('data-icon', name);

		// Default
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				rotate: 0,
			},
			mode: null,
		});

		// 90deg
		element.setAttribute('data-rotate', '90deg');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				rotate: 1,
			},
			mode: null,
		});

		// 180deg
		element.setAttribute('data-rotate', '2');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				rotate: 2,
			},
			mode: null,
		});

		// 270deg
		element.setAttribute('data-rotate', '75%');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				rotate: 3,
			},
			mode: null,
		});

		// 270deg
		element.setAttribute('data-rotate', '-90deg');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				rotate: 3,
			},
			mode: null,
		});

		// Invalid values or 0 deg
		element.setAttribute('data-rotate', '45deg');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
			},
			mode: null,
		});

		element.setAttribute('data-rotate', '360deg');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
			},
			mode: null,
		});

		element.setAttribute('data-rotate', 'true');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
			},
			mode: null,
		});

		element.setAttribute('data-rotate', '-100%');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
			},
			mode: null,
		});
	});

	it('Flip', () => {
		const element = document.createElement('span');

		// Set icon name
		const name = 'mdi:home';
		const icon = {
			provider: '',
			prefix: 'mdi',
			name: 'home',
		};
		element.setAttribute('data-icon', name);

		// Default
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				hFlip: false,
				vFlip: false,
			},
			mode: null,
		});

		// Horizontal
		element.setAttribute('data-flip', 'horizontal');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				hFlip: true,
			},
			mode: null,
		});

		// Both
		element.setAttribute('data-vFlip', 'true');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				hFlip: true,
				vFlip: true,
			},
			mode: null,
		});

		// Vertical
		element.removeAttribute('data-vFlip');
		element.setAttribute('data-flip', 'vertical');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				vFlip: true,
			},
			mode: null,
		});

		// Overwriting shorthand attr
		element.setAttribute('data-vFlip', 'false');
		element.setAttribute('data-flip', 'vertical');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
			},
			mode: null,
		});

		// Both
		element.removeAttribute('data-vFlip');
		element.setAttribute('data-flip', 'vertical,horizontal');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
				hFlip: true,
				vFlip: true,
			},
			mode: null,
		});

		// None
		element.setAttribute('data-vFlip', 'false');
		element.setAttribute('data-hFlip', 'false');
		expect(getElementProps(element)).toEqual({
			name,
			icon,
			customisations: {
				...defaults,
			},
			mode: null,
		});
	});
});
