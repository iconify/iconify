import React from 'react';
import { InlineIcon } from '../../lib/iconify';
import renderer from 'react-test-renderer';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Dimensions', () => {
	test('height', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} height="48" />
		);
		const tree = component.toJSON();

		expect(tree.props.height).toStrictEqual('48');
		expect(tree.props.width).toStrictEqual('48');
	});

	test('width and height', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} width={32} height="48" />
		);
		const tree = component.toJSON();

		expect(tree.props.height).toStrictEqual('48');
		expect(tree.props.width).toStrictEqual('32');
	});

	test('auto', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} height="auto" />
		);
		const tree = component.toJSON();

		expect(tree.props.height).toStrictEqual('24');
		expect(tree.props.width).toStrictEqual('24');
	});
});
