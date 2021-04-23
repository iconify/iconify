import React from 'react';
import { Icon, InlineIcon } from '../../dist/offline';
import renderer from 'react-test-renderer';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Empty icon', () => {
	test('basic test', () => {
		const component = renderer.create(<Icon />);
		const tree = component.toJSON();

		expect(tree).toMatchObject({
			type: 'span',
			props: {},
			children: null,
		});
	});

	test('with child node', () => {
		const component = renderer.create(
			<Icon>
				<i class="fa fa-home" />
			</Icon>
		);
		const tree = component.toJSON();

		expect(tree).toMatchObject({
			type: 'i',
			props: {},
			children: null,
		});
	});

	test('with text child node', () => {
		const component = renderer.create(<Icon>icon</Icon>);
		const tree = component.toJSON();

		expect(tree).toMatch('icon');
	});

	test('with multiple childen', () => {
		const component = renderer.create(
			<Icon>
				<i class="fa fa-home" />
				Home
			</Icon>
		);
		const tree = component.toJSON();

		expect(tree).toMatchObject([
			{
				type: 'i',
				props: {},
				children: null,
			},
			'Home',
		]);
	});
});
