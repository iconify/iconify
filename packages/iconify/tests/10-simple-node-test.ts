import 'mocha';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import Iconify, { IconifyIcon } from '../dist/iconify';

describe('Testing Iconify with Node.js', () => {
	it('Basic functions', () => {
		expect(typeof Iconify).to.be.equal('object');

		// Placeholder value should have been replaced during compilation
		const version = JSON.parse(
			readFileSync(dirname(__dirname) + '/package.json', 'utf8')
		).version;
		expect(Iconify.getVersion()).to.be.equal(version);
	});

	it('Builder functions', () => {
		// calculateSize() should work in Node.js
		expect(Iconify.calculateSize('24px', 2)).to.be.equal('48px');

		// replaceIDs() should work in Node.js
		const test = '<div id="foo" />';
		expect(Iconify.replaceIDs(test)).to.not.be.equal(test);
	});

	it('Storage functions', () => {
		const prefix = 'node-test-storage';
		const name = prefix + ':bar';

		// Empty results
		expect(Iconify.iconExists(name)).to.be.equal(false);
		expect(Iconify.getIcon(name)).to.be.eql(null);
		expect(Iconify.listIcons('', prefix)).to.be.eql([]);

		// Test addIcon()
		expect(
			Iconify.addIcon(name, {
				body: '<g />',
				width: 24,
				height: 24,
			})
		).to.be.equal(true);

		expect(Iconify.iconExists(name)).to.be.equal(true);
		const expected: Required<IconifyIcon> = {
			body: '<g />',
			width: 24,
			height: 24,
			left: 0,
			top: 0,
			hFlip: false,
			vFlip: false,
			rotate: 0,
		};
		expect(Iconify.getIcon(name)).to.be.eql(expected);
		expect(Iconify.listIcons('', prefix)).to.be.eql([name]);

		// Test addCollection()
		expect(
			Iconify.addCollection({
				prefix,
				icons: {
					test1: {
						body: '<g />',
					},
				},
				width: 24,
				height: 24,
			})
		).to.be.equal(true);
		expect(Iconify.listIcons('', prefix)).to.be.eql([
			name,
			prefix + ':test1',
		]);
	});
});
