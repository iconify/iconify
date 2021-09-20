import { stringToIcon, validateIcon } from '@iconify/utils/lib/icon/name';

describe('Testing icon name', () => {
	it('Simple icon names', () => {
		let icon;

		// Simple prefix-name
		icon = stringToIcon('fa-home');
		expect(icon).toEqual({
			provider: '',
			prefix: 'fa',
			name: 'home',
		});
		expect(validateIcon(icon)).toBe(true);

		// Simple prefix:name
		icon = stringToIcon('fa:arrow-left');
		expect(icon).toEqual({
			provider: '',
			prefix: 'fa',
			name: 'arrow-left',
		});
		expect(validateIcon(icon)).toBe(true);

		// Longer prefix:name
		icon = stringToIcon('mdi-light:home-outline');
		expect(icon).toEqual({
			provider: '',
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIcon(icon)).toBe(true);

		// Simple word without prefix
		icon = stringToIcon('home');
		expect(icon).toEqual(null);
		expect(validateIcon(icon)).toBe(false);

		// Same as above, but with empty names enabled
		icon = stringToIcon('home', false, true);
		expect(icon).toEqual({
			provider: '',
			prefix: '',
			name: 'home',
		});
		expect(validateIcon(icon)).toBe(false);
		expect(validateIcon(icon, true)).toBe(true);

		// Missing icon name
		icon = stringToIcon('@iconify-home-icon');
		expect(icon).toEqual(null);
		expect(validateIcon(icon)).toBe(false);

		// Same as above, but with empty names enabled
		icon = stringToIcon('@iconify-home-icon', false, true);
		expect(icon).toEqual(null);
		expect(validateIcon(icon)).toBe(false);
		expect(validateIcon(icon, true)).toBe(false);

		// Underscore is not an acceptable separator
		icon = stringToIcon('fa_home');
		expect(icon).toEqual(null);
		expect(validateIcon(icon)).toBe(false);

		// Same as above, but with empty names enabled
		icon = stringToIcon('fa_home', false, true);
		expect(icon).toEqual({
			provider: '',
			prefix: '',
			name: 'fa_home',
		});
		expect(validateIcon(icon)).toBe(false);
		expect(validateIcon(icon, true)).toBe(false);

		// Invalid character '_': fail validateIcon
		icon = stringToIcon('fa:home_outline');
		expect(icon).toEqual({
			provider: '',
			prefix: 'fa',
			name: 'home_outline',
		});
		expect(validateIcon(icon)).toBe(false);

		// Too many colons: fail stringToIcon
		icon = stringToIcon('mdi:light:home:outline');
		expect(icon).toEqual(null);
		expect(validateIcon(icon)).toBe(false);

		// Upper case: fail validateIcon
		icon = stringToIcon('MD:Home');
		expect(icon).toEqual({
			provider: '',
			prefix: 'MD',
			name: 'Home',
		});
		expect(validateIcon(icon)).toBe(false);

		// Numbers: pass
		icon = stringToIcon('1:foo');
		expect(icon).toEqual({
			provider: '',
			prefix: '1',
			name: 'foo',
		});
		expect(validateIcon(icon)).toBe(true);

		// Accented letters: fail validateIcon
		icon = stringToIcon('md-fõö');
		expect(icon).toEqual({
			provider: '',
			prefix: 'md',
			name: 'fõö',
		});
		expect(validateIcon(icon)).toBe(false);
	});

	it('Providers', () => {
		let icon;

		// Simple @provider:prefix-name
		icon = stringToIcon('@iconify:fa-home');
		expect(icon).toEqual({
			provider: 'iconify',
			prefix: 'fa',
			name: 'home',
		});
		expect(validateIcon(icon)).toBe(true);

		// Simple @provider:prefix:name
		icon = stringToIcon('@iconify:fa:arrow-left');
		expect(icon).toEqual({
			provider: 'iconify',
			prefix: 'fa',
			name: 'arrow-left',
		});
		expect(validateIcon(icon)).toBe(true);

		// Longer @provider:prefix:name
		icon = stringToIcon('@iconify-backup:mdi-light:home-outline');
		expect(icon).toEqual({
			provider: 'iconify-backup',
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIcon(icon)).toBe(true);

		// Missing @ for provider
		icon = stringToIcon('iconify-backup:mdi-light:home-outline');
		expect(icon).toEqual({
			provider: 'iconify-backup',
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIcon(icon)).toBe(true);

		// Too many colons: fail stringToIcon
		icon = stringToIcon('@mdi:light:home:outline');
		expect(icon).toEqual(null);
		expect(validateIcon(icon)).toBe(false);

		// Same as above, empty names allowed
		icon = stringToIcon('@mdi:light:home:outline', false, true);
		expect(icon).toEqual(null);

		// Upper case: fail validateIcon
		icon = stringToIcon('@MD:home-outline');
		expect(icon).toEqual({
			provider: 'MD',
			prefix: 'home',
			name: 'outline',
		});
		expect(validateIcon(icon)).toBe(false);
	});
});
