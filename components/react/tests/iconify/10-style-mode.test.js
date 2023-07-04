import React from 'react';
import { Icon } from '../../dist/iconify';
import renderer from 'react-test-renderer';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Rendering as span', () => {
	test('basic icon', () => {
		const component = renderer.create(
			<Icon
				icon={iconData}
				mode="style"
				onLoad={() => {
					// Should be called only for icons loaded from API
					throw new Error('onLoad called for object!');
				}}
			/>
		);
		const tree = component.toJSON();

		expect(tree).toMatchObject({
			type: 'span',
			props: {
				style: {
					'--svg': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z' fill='currentColor'/%3E%3C/svg%3E")`,
					'width': '1em',
					'height': '1em',
					'display': 'inline-block',
					'backgroundColor': 'currentColor',
					// 'webkitMaskImage': 'var(--svg)',
					// 'webkitMaskRepeat': 'no-repeat',
					// 'webkitMaskSize': '100% 100%',
					'maskImage': 'var(--svg)',
					'maskRepeat': 'no-repeat',
					'maskSize': '100% 100%',
				},
			},
			children: null,
		});
	});

	test('custom dimensions', () => {
		const component = renderer.create(
			<Icon
				icon={iconData}
				mode="style"
				width="32"
				height={48}
				onLoad={() => {
					// Should be called only for icons loaded from API
					throw new Error('onLoad called for object!');
				}}
			/>
		);
		const tree = component.toJSON();

		expect(tree).toMatchObject({
			type: 'span',
			props: {
				style: {
					'--svg': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z' fill='currentColor'/%3E%3C/svg%3E")`,
					'width': '32px',
					'height': '48px',
					'display': 'inline-block',
					'backgroundColor': 'currentColor',
					// 'webkitMaskImage': 'var(--svg)',
					// 'webkitMaskRepeat': 'no-repeat',
					// 'webkitMaskSize': '100% 100%',
					'maskImage': 'var(--svg)',
					'maskRepeat': 'no-repeat',
					'maskSize': '100% 100%',
				},
			},
			children: null,
		});
	});
});
