import 'mocha';
import { expect } from 'chai';
import {
	stringToIcon,
	validateIcon,
	IconifyIconName,
} from '../../lib/icon/name';

describe('Testing icon name', () => {
	it('Converting and validating', () => {
		let icon;

		// Simple prefix-name
		icon = stringToIcon('fa-home') as IconifyIconName;
		expect(icon).to.be.eql({
			prefix: 'fa',
			name: 'home',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Simple prefix:name
		icon = stringToIcon('fa:arrow-left') as IconifyIconName;
		expect(icon).to.be.eql({
			prefix: 'fa',
			name: 'arrow-left',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Longer prefix:name
		icon = stringToIcon('mdi-light:home-outline') as IconifyIconName;
		expect(icon).to.be.eql({
			prefix: 'mdi-light',
			name: 'home-outline',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Underscore is not an acceptable separator
		icon = stringToIcon('fa_home');
		expect(icon).to.be.eql(null);
		expect(validateIcon(icon)).to.be.equal(false);

		// Invalid character '_': fail validateIcon
		icon = stringToIcon('fa:home_outline') as IconifyIconName;
		expect(icon).to.be.eql({
			prefix: 'fa',
			name: 'home_outline',
		});
		expect(validateIcon(icon)).to.be.equal(false);

		// Too many colons: fail stringToIcon
		icon = stringToIcon('mdi-light:home:outline');
		expect(icon).to.be.eql(null);
		expect(validateIcon(icon)).to.be.equal(false);

		// Upper case: fail validateIcon
		icon = stringToIcon('MD:Home') as IconifyIconName;
		expect(icon).to.be.eql({
			prefix: 'MD',
			name: 'Home',
		});
		expect(validateIcon(icon)).to.be.equal(false);

		// Numbers: pass
		icon = stringToIcon('1:foo') as IconifyIconName;
		expect(icon).to.be.eql({
			prefix: '1',
			name: 'foo',
		});
		expect(validateIcon(icon)).to.be.equal(true);

		// Accented letters: fail validateIcon
		icon = stringToIcon('md-fõö') as IconifyIconName;
		expect(icon).to.be.eql({
			prefix: 'md',
			name: 'fõö',
		});
		expect(validateIcon(icon)).to.be.equal(false);
	});
});
