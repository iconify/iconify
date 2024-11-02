import type { IconifyIconName } from '../lib/icon/name';
import { stringToIcon, validateIconName } from '../lib/icon/name';

describe('Testing icon name', () => {
	test('Simple icon names', () => {
		let icon;

		// Simple prefix-name
		icon = stringToIcon('fa-home') as IconifyIconName;
		expect(icon).toEqual({
			provider: '',
			prefix: 'fa',
			name: 'home',
		});
		expect(validateIconName(icon)).toBe(true);

		// Simple prefix:name
		icon = stringToIcon('fa:arrow-left') as IconifyIconName;
		expect(icon).toEqual({
			provider: '',
			prefix: 'fa',
			name: 'arrow-left',
		});
		expect(validateIconName(icon)).toBe(true);

		// Longer prefix:name
		icon = stringToIcon('mdi-light:home-outline') as IconifyIconName;
		expect(icon).toEqual({
			provider: '',
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIconName(icon)).toBe(true);

		// Simple word without prefix
		icon = stringToIcon('home');
		expect(icon).toEqual(null);
		expect(validateIconName(icon)).toBe(false);

		// Same as above, but with empty names enabled
		icon = stringToIcon('home', false, true);
		expect(icon).toEqual({
			provider: '',
			prefix: '',
			name: 'home',
		});
		expect(validateIconName(icon)).toBe(false);
		expect(validateIconName(icon, true)).toBe(true);

		// Missing icon name
		icon = stringToIcon('@iconify-home-icon');
		expect(icon).toEqual(null);
		expect(validateIconName(icon)).toBe(false);

		// Same as above, but with empty names enabled
		icon = stringToIcon('@iconify-home-icon', false, true);
		expect(icon).toEqual(null);
		expect(validateIconName(icon)).toBe(false);
		expect(validateIconName(icon, true)).toBe(false);

		// No prefix
		icon = stringToIcon('fa_home');
		expect(icon).toEqual(null);
		expect(validateIconName(icon)).toBe(false);

		// Same as above, but with empty names enabled
		icon = stringToIcon('fa_home', false, true);
		expect(icon).toEqual({
			provider: '',
			prefix: '',
			name: 'fa_home',
		});
		expect(validateIconName(icon)).toBe(false);
		expect(validateIconName(icon, true)).toBe(true);

		// Underscore is allowed now
		icon = stringToIcon('fa:home_outline') as IconifyIconName;
		expect(icon).toEqual({
			provider: '',
			prefix: 'fa',
			name: 'home_outline',
		});
		expect(validateIconName(icon)).toBe(true);

		// Too many colons: fail stringToIcon
		icon = stringToIcon('mdi:light:home:outline');
		expect(icon).toEqual(null);
		expect(validateIconName(icon)).toBe(false);

		// Upper case: allowed now
		icon = stringToIcon('MD:Home') as IconifyIconName;
		expect(icon).toEqual({
			provider: '',
			prefix: 'MD',
			name: 'Home',
		});
		expect(validateIconName(icon)).toBe(true);

		// Numbers: pass
		icon = stringToIcon('1:foo') as IconifyIconName;
		expect(icon).toEqual({
			provider: '',
			prefix: '1',
			name: 'foo',
		});
		expect(validateIconName(icon)).toBe(true);

		// Accented letters: allowed now
		icon = stringToIcon('md-fõö') as IconifyIconName;
		expect(icon).toEqual({
			provider: '',
			prefix: 'md',
			name: 'fõö',
		});
		expect(validateIconName(icon)).toBe(true);
	});

	it('Providers', () => {
		let icon;

		// Simple @provider:prefix-name
		icon = stringToIcon('@iconify:fa-home') as IconifyIconName;
		expect(icon).toEqual({
			provider: 'iconify',
			prefix: 'fa',
			name: 'home',
		});
		expect(validateIconName(icon)).toBe(true);

		// Simple @provider:prefix:name
		icon = stringToIcon('@iconify:fa:arrow-left') as IconifyIconName;
		expect(icon).toEqual({
			provider: 'iconify',
			prefix: 'fa',
			name: 'arrow-left',
		});
		expect(validateIconName(icon)).toBe(true);

		// Longer @provider:prefix:name
		icon = stringToIcon(
			'@iconify-backup:mdi-light:home-outline'
		) as IconifyIconName;
		expect(icon).toEqual({
			provider: 'iconify-backup',
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIconName(icon)).toBe(true);

		// Missing @ for provider
		icon = stringToIcon(
			'iconify-backup:mdi-light:home-outline'
		) as IconifyIconName;
		expect(icon).toEqual({
			provider: 'iconify-backup',
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIconName(icon)).toBe(true);

		// Too many colons: fail stringToIcon
		icon = stringToIcon('@mdi:light:home:outline');
		expect(icon).toEqual(null);
		expect(validateIconName(icon)).toBe(false);

		// Same as above, empty names allowed
		icon = stringToIcon('@mdi:light:home:outline', false, true);
		expect(icon).toEqual(null);

		// Upper case: allowed now
		icon = stringToIcon('@MD:home-outline') as IconifyIconName;
		expect(icon).toEqual({
			provider: 'MD',
			prefix: 'home',
			name: 'outline',
		});
		expect(validateIconName(icon)).toBe(true);
	});
});
