import React from 'react';
import { Icon, InlineIcon } from '../../dist/iconify';
import renderer from 'react-test-renderer';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Creating component using object', () => {
	test('basic icon', () => {
		const component = renderer.create(
			<Icon
				icon={iconData}
				onLoad={() => {
					// Should be called only for icons loaded from API
					throw new Error('onLoad called for object!');
				}}
			/>
		);
		const tree = component.toJSON();

		expect(tree).toMatchObject({
			type: 'svg',
			props: {
				'xmlns': 'http://www.w3.org/2000/svg',
				'xmlnsXlink': 'http://www.w3.org/1999/xlink',
				'aria-hidden': true,
				'role': 'img',
				'style': {},
				'dangerouslySetInnerHTML': {
					__html: iconData.body,
				},
				'width': '1em',
				'height': '1em',
				'preserveAspectRatio': 'xMidYMid meet',
				'viewBox': '0 0 ' + iconData.width + ' ' + iconData.height,
			},
			children: null,
		});
	});

	test('inline icon', () => {
		const component = renderer.create(<InlineIcon icon={iconData} />);
		const tree = component.toJSON();

		expect(tree).toMatchObject({
			type: 'svg',
			props: {
				'xmlns': 'http://www.w3.org/2000/svg',
				'xmlnsXlink': 'http://www.w3.org/1999/xlink',
				'aria-hidden': true,
				'role': 'img',
				'style': {
					verticalAlign: '-0.125em',
				},
				'dangerouslySetInnerHTML': {
					__html: iconData.body,
				},
				'width': '1em',
				'height': '1em',
				'preserveAspectRatio': 'xMidYMid meet',
				'viewBox': '0 0 ' + iconData.width + ' ' + iconData.height,
			},
			children: null,
		});
	});
});
