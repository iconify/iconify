import React from 'react';
import { Icon } from '../../lib/iconify';
import renderer from 'react-test-renderer';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Inline attribute', () => {
	test('string', () => {
		const component = renderer.create(
			<Icon icon={iconData} inline="true" />
		);
		const tree = component.toJSON();

		expect(tree.props.style.verticalAlign).toStrictEqual('-0.125em');
	});

	test('false string', () => {
		// "false" = true
		const component = renderer.create(
			<Icon icon={iconData} inline="false" />
		);
		const tree = component.toJSON();

		expect(tree.props.style.verticalAlign).toStrictEqual('-0.125em');
	});
});
