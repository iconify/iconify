import React from 'react';
import { InlineIcon } from '../../dist/offline';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rotation', () => {
	test('number', () => {
		const renderResult = render(<InlineIcon icon={iconData} rotate={1} />);
		expect(renderResult.container.innerHTML).toContain(
			'<g transform="rotate(90 12 12)">'
		);
	});

	test('string', () => {
		const renderResult = render(
			// @ts-expect-error
			<InlineIcon icon={iconData} rotate="180deg" />
		);
		expect(renderResult.container.innerHTML).toContain(
			'<g transform="rotate(180 12 12)">'
		);
	});
});

describe('Flip', () => {
	test('boolean', () => {
		const renderResult = render(
			<InlineIcon icon={iconData} hFlip={true} />
		);
		expect(renderResult.container.innerHTML).toContain(
			'<g transform="translate(24 0) scale(-1 1)">'
		);
	});

	test('string', () => {
		const renderResult = render(
			<InlineIcon icon={iconData} flip="vertical" />
		);
		expect(renderResult.container.innerHTML).toContain(
			'<g transform="translate(0 24) scale(1 -1)">'
		);
	});

	test('string and boolean', () => {
		const renderResult = render(
			<InlineIcon icon={iconData} flip="horizontal" vFlip={true} />
		);
		// horizontal + vertical = 180deg rotation
		expect(renderResult.container.innerHTML).toContain(
			'<g transform="rotate(180 12 12)">'
		);
		expect(renderResult.container.innerHTML).not.toContain('scale');
	});

	test('string for boolean attribute', () => {
		const renderResult = render(
			// @ts-expect-error
			<InlineIcon icon={iconData} hFlip="true" />
		);
		expect(renderResult.container.innerHTML).toContain(
			'<g transform="translate(24 0) scale(-1 1)">'
		);
	});

	test('shorthand and boolean', () => {
		// 'flip' is processed after 'hFlip' because of order of elements in object, overwriting value
		const renderResult = render(
			<InlineIcon icon={iconData} hFlip={false} flip="horizontal" />
		);
		expect(renderResult.container.innerHTML).toContain(
			'<g transform="translate(24 0) scale(-1 1)">'
		);
	});

	test('shorthand and boolean as string', () => {
		const renderResult = render(
			// @ts-expect-error
			<InlineIcon icon={iconData} flip="vertical" hFlip="true" />
		);
		// horizontal + vertical = 180deg rotation
		expect(renderResult.container.innerHTML).toContain(
			'<g transform="rotate(180 12 12)">'
		);
		expect(renderResult.container.innerHTML).not.toContain('scale');
	});

	test('wrong case', () => {
		const renderResult = render(
			// @ts-expect-error
			<InlineIcon icon={iconData} vflip={true} />
		);
		expect(renderResult.container.innerHTML).not.toContain('transform');
	});
});
