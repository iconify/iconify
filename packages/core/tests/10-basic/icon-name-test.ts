import 'mocha';
import { expect } from 'chai';
import type { IconifyIconName } from '../../lib/icon/name';
import { stringToIcon, validateIcon } from '../../lib/icon/name';

describe('Testing icon name', () => {
	it('Simple icon names', () => {
		let icon;

		// Simple prefix-name
		icon = stringToIcon('fa-home') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: '',
			prefix: 'fa',
			name: 'home',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Simple prefix:name
		icon = stringToIcon('fa:arrow-left') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: '',
			prefix: 'fa',
			name: 'arrow-left',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Longer prefix:name
		icon = stringToIcon('mdi-light:home-outline') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: '',
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Simple word without prefix
		icon = stringToIcon('home');
		expect(icon).to.be.eql(null);
		expect(validateIcon(icon)).to.be.equal(false);

		// Same as above, but with empty names enabled
		icon = stringToIcon('home', false, true);
		expect(icon).to.be.eql({
			provider: '',
			prefix: '',
			name: 'home',
		});
		expect(validateIcon(icon)).to.be.equal(false);
		expect(validateIcon(icon, true)).to.be.equal(true);

		// Missing icon name
		icon = stringToIcon('@iconify-home-icon');
		expect(icon).to.be.eql(null);
		expect(validateIcon(icon)).to.be.equal(false);

		// Same as above, but with empty names enabled
		icon = stringToIcon('@iconify-home-icon', false, true);
		expect(icon).to.be.eql(null);
		expect(validateIcon(icon)).to.be.equal(false);
		expect(validateIcon(icon, true)).to.be.equal(false);

		// Underscore is not an acceptable separator
		icon = stringToIcon('fa_home');
		expect(icon).to.be.eql(null);
		expect(validateIcon(icon)).to.be.equal(false);

		// Same as above, but with empty names enabled
		icon = stringToIcon('fa_home', false, true);
		expect(icon).to.be.eql({
			provider: '',
			prefix: '',
			name: 'fa_home',
		});
		expect(validateIcon(icon)).to.be.equal(false);
		expect(validateIcon(icon, true)).to.be.equal(false);

		// Invalid character '_': fail validateIcon
		icon = stringToIcon('fa:home_outline') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: '',
			prefix: 'fa',
			name: 'home_outline',
		});
		expect(validateIcon(icon)).to.be.equal(false);

		// Too many colons: fail stringToIcon
		icon = stringToIcon('mdi:light:home:outline');
		expect(icon).to.be.eql(null);
		expect(validateIcon(icon)).to.be.equal(false);

		// Upper case: fail validateIcon
		icon = stringToIcon('MD:Home') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: '',
			prefix: 'MD',
			name: 'Home',
		});
		expect(validateIcon(icon)).to.be.equal(false);

		// Numbers: pass
		icon = stringToIcon('1:foo') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: '',
			prefix: '1',
			name: 'foo',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Accented letters: fail validateIcon
		icon = stringToIcon('md-fõö') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: '',
			prefix: 'md',
			name: 'fõö',
		});
		expect(validateIcon(icon)).to.be.equal(false);
	});

	it('Providers', () => {
		let icon;

		// Simple @provider:prefix-name
		icon = stringToIcon('@iconify:fa-home') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: 'iconify',
			prefix: 'fa',
			name: 'home',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Simple @provider:prefix:name
		icon = stringToIcon('@iconify:fa:arrow-left') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: 'iconify',
			prefix: 'fa',
			name: 'arrow-left',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Longer @provider:prefix:name
		icon = stringToIcon(
			'@iconify-backup:mdi-light:home-outline'
		) as IconifyIconName;
		expect(icon).to.be.eql({
			provider: 'iconify-backup',
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Missing @ for provider
		icon = stringToIcon(
			'iconify-backup:mdi-light:home-outline'
		) as IconifyIconName;
		expect(icon).to.be.eql({
			provider: 'iconify-backup',
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Too many colons: fail stringToIcon
		icon = stringToIcon('@mdi:light:home:outline');
		expect(icon).to.be.eql(null);
		expect(validateIcon(icon)).to.be.equal(false);

		// Same as above, empty names allowed
		icon = stringToIcon('@mdi:light:home:outline', false, true);
		expect(icon).to.be.eql(null);

		// Upper case: fail validateIcon
		icon = stringToIcon('@MD:home-outline') as IconifyIconName;
		expect(icon).to.be.eql({
			provider: 'MD',
			prefix: 'home',
			name: 'outline',
		});
		expect(validateIcon(icon)).to.be.equal(false);
	});
});
