import React from 'react';
import { Icon } from '../../lib/offline';
import renderer from 'react-test-renderer';

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
