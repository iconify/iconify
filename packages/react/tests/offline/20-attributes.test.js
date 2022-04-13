import React from 'react';
import { Icon, InlineIcon } from '../../dist/offline';
import renderer from 'react-test-renderer';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Passing attributes', () => {
	test('title', () => {
		const component = renderer.create(
			<Icon icon={iconData} title="Icon!" />
		);
		const tree = component.toJSON();

		expect(tree.props.title).toStrictEqual('Icon!');
	});

	test('aria-hidden', () => {
		// dashes, string value
		const component = renderer.create(
			<InlineIcon icon={iconData} aria-hidden="false" />
		);
		const tree = component.toJSON();

		expect(tree.props['aria-hidden']).toStrictEqual(void 0);
	});

	test('ariaHidden', () => {
		// camelCase, boolean value
		const component = renderer.create(
			<InlineIcon icon={iconData} ariaHidden={false} />
		);
		const tree = component.toJSON();

		expect(tree.props['aria-hidden']).toStrictEqual(void 0);
	});

	test('style', () => {
		const component = renderer.create(
			<InlineIcon
				icon={iconData}
				style={{ verticalAlign: '0', color: 'red' }}
			/>
		);
		const tree = component.toJSON();

		expect(tree.props.style).toMatchObject({
			verticalAlign: '0',
			color: 'red',
		});
	});

	test('color', () => {
		const component = renderer.create(<Icon icon={iconData} color="red" />);
		const tree = component.toJSON();

		expect(tree.props.style).toMatchObject({
			color: 'red',
		});
	});

	test('color with style', () => {
		const component = renderer.create(
			<Icon icon={iconData} color="red" style={{ color: 'green' }} />
		);
		const tree = component.toJSON();

		// `style` overrides `color`
		expect(tree.props.style).toMatchObject({
			color: 'green',
		});
	});

	test('attributes that cannot change', () => {
		const component = renderer.create(
			<InlineIcon
				icon={iconData}
				viewBox="0 0 0 0"
				preserveAspectRatio="none"
			/>
		);
		const tree = component.toJSON();

		expect(tree.props.viewBox).toStrictEqual('0 0 24 24');
		expect(tree.props.preserveAspectRatio).toStrictEqual('xMidYMid meet');
	});
});
