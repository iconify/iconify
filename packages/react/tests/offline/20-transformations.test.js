import React from 'react';
import { InlineIcon } from '../../dist/offline';
import renderer from 'react-test-renderer';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 32,
};

describe('Rotation', () => {
	test('number', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} rotate={1} />
		);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toStrictEqual(iconData.body);
		expect(body).toMatch('rotate(90 ');
	});

	test('string', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} rotate="180deg" />
		);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toStrictEqual(iconData.body);
		expect(body).toMatch('rotate(180 ');
	});
});

describe('Flip', () => {
	test('boolean', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} hFlip={true} />
		);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toStrictEqual(iconData.body);
		expect(body).toMatch('scale(-1 1)');
	});

	test('string', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} flip="vertical" />
		);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toStrictEqual(iconData.body);
		expect(body).toMatch('scale(1 -1)');
	});

	test('string and boolean', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} flip="horizontal" vFlip={true} />
		);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toStrictEqual(iconData.body);
		// horizontal + vertical = 180deg rotation
		expect(body).toMatch('rotate(180 ');
	});

	test('string for boolean attribute', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} hFlip="true" />
		);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toStrictEqual(iconData.body);
		expect(body).toMatch('scale(-1 1)');
	});

	test('shorthand and boolean', () => {
		// 'flip' is processed after 'hFlip', overwriting value
		const component = renderer.create(
			<InlineIcon icon={iconData} flip="horizontal" hFlip={false} />
		);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toStrictEqual(iconData.body);
		expect(body).toMatch('scale(-1 1)');
	});

	test('shorthand and boolean as string', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} flip="vertical" hFlip="true" />
		);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toStrictEqual(iconData.body);
		// horizontal + vertical = 180deg rotation
		expect(body).toMatch('rotate(180 ');
	});

	test('wrong case', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} vflip={true} />
		);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toMatch('scale(');
	});
});

describe('Alignment and slice', () => {
	test('vAlign and slice', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} vAlign="top" slice={true} />
		);
		const tree = component.toJSON();

		expect(tree.props.preserveAspectRatio).toStrictEqual('xMidYMin slice');
	});

	test('string', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} align="left bottom" />
		);
		const tree = component.toJSON();

		expect(tree.props.preserveAspectRatio).toStrictEqual('xMinYMax meet');
	});
});
