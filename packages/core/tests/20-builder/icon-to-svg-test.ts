import 'mocha';
import { expect } from 'chai';
import { iconToSVG, IconifyIconBuildResult } from '../../lib/builder';
import { FullIconifyIcon, iconDefaults, fullIcon } from '../../lib/icon';
import {
	FullIconCustomisations,
	defaults,
	fullCustomisations,
} from '../../lib/customisations';

describe('Testing iconToSVG', () => {
	it('Empty icon', () => {
		const custom: FullIconCustomisations = defaults;
		const icon: FullIconifyIcon = iconDefaults;
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '1em',
				height: '1em',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 16',
			},
			body: '',
		};

		const result = iconToSVG(icon, custom);
		expect(result).to.be.eql(expected);
	});

	it('Auto size, inline, body', () => {
		const custom: FullIconCustomisations = fullCustomisations({
			inline: true,
			height: 'auto',
		});
		const icon: FullIconifyIcon = fullIcon({
			body: '<path d="" />',
		});
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '16',
				height: '16',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 16',
			},
			body: '<path d="" />',
			inline: true,
		};

		const result = iconToSVG(icon, custom);
		expect(result).to.be.eql(expected);
	});

	it('Auto size, inline, body', () => {
		const custom: FullIconCustomisations = fullCustomisations({
			inline: true,
			height: 'auto',
		});
		const icon: FullIconifyIcon = fullIcon({
			body: '<path d="" />',
		});
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '16',
				height: '16',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 16',
			},
			body: '<path d="" />',
			inline: true,
		};

		const result = iconToSVG(icon, custom);
		expect(result).to.be.eql(expected);
	});

	it('Custom size, alignment', () => {
		const custom: FullIconCustomisations = fullCustomisations({
			height: 'auto',
			hAlign: 'left',
			slice: true,
		});
		const icon: FullIconifyIcon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '20',
				height: '16',
				preserveAspectRatio: 'xMinYMid slice',
				viewBox: '0 0 20 16',
			},
			body: '<path d="..." />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).to.be.eql(expected);
	});

	it('Rotation, alignment', () => {
		const custom: FullIconCustomisations = fullCustomisations({
			height: '40px',
			vAlign: 'bottom',
			rotate: 1,
		});
		const icon: FullIconifyIcon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '32px',
				height: '40px',
				preserveAspectRatio: 'xMidYMax meet',
				viewBox: '0 0 16 20',
			},
			body: '<g transform="rotate(90 8 8)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).to.be.eql(expected);
	});

	it('Flip, alignment', () => {
		const custom: FullIconCustomisations = fullCustomisations({
			height: '32',
			vAlign: 'top',
			hAlign: 'right',
			hFlip: true,
		});
		const icon: FullIconifyIcon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '40',
				height: '32',
				preserveAspectRatio: 'xMaxYMin meet',
				viewBox: '0 0 20 16',
			},
			body:
				'<g transform="translate(20 0) scale(-1 1)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).to.be.eql(expected);
	});

	it('Flip, rotation', () => {
		const custom: FullIconCustomisations = fullCustomisations({
			vFlip: true,
			rotate: 1,
		});
		const icon: FullIconifyIcon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '0.8em',
				height: '1em',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 16 20',
			},
			body:
				'<g transform="rotate(90 8 8) translate(0 16) scale(1 -1)"><path d="..." /></g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).to.be.eql(expected);
	});

	it('Flip and rotation canceling eachother', () => {
		const custom: FullIconCustomisations = fullCustomisations({
			width: '1em',
			height: 'auto',
			hFlip: true,
			vFlip: true,
			rotate: 2,
		});
		const icon: FullIconifyIcon = fullIcon({
			width: 20,
			height: 16,
			body: '<path d="..." />',
		});
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '1em',
				height: '16',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 20 16',
			},
			body: '<path d="..." />',
		};

		const result = iconToSVG(icon, custom);
		expect(result).to.be.eql(expected);
	});

	it('Flip with real icon', () => {
		const iconBody =
			'<g stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" fill-rule="evenodd"><path d="M40 64l48-48" class="animation-delay-0 animation-duration-10 animate-stroke stroke-length-102"/><path d="M40 64l48 48" class="animation-delay-0 animation-duration-10 animate-stroke stroke-length-102"/></g>';

		const custom: FullIconCustomisations = fullCustomisations({});
		const icon: FullIconifyIcon = fullIcon({
			body: iconBody,
			width: 128,
			height: 128,
			hFlip: true,
		});
		const expected: IconifyIconBuildResult = {
			attributes: {
				width: '1em',
				height: '1em',
				preserveAspectRatio: 'xMidYMid meet',
				viewBox: '0 0 128 128',
			},
			body:
				'<g transform="translate(128 0) scale(-1 1)">' +
				iconBody +
				'</g>',
		};

		const result = iconToSVG(icon, custom);
		expect(result).to.be.eql(expected);
	});
});
