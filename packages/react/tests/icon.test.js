import React from 'react';
import { Icon, InlineIcon, addIcon, addCollection } from '../';
import renderer from 'react-test-renderer';

const iconData = {
	body:
		'<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

const iconDataWithID = {
	body:
		'<defs><path id="ssvg-id-1st-place-medala" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medald" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalf" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalh" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalj" d="M.93.01h120.55v58.36H.93z"/><path id="ssvg-id-1st-place-medalm" d="M.93.01h120.55v58.36H.93z"/><path d="M52.849 78.373v-3.908c3.681-.359 6.25-.958 7.703-1.798c1.454-.84 2.54-2.828 3.257-5.962h4.021v40.385h-5.437V78.373h-9.544z" id="ssvg-id-1st-place-medalp"/><linearGradient x1="49.998%" y1="-13.249%" x2="49.998%" y2="90.002%" id="ssvg-id-1st-place-medalb"><stop stop-color="#1E88E5" offset="13.55%"/><stop stop-color="#1565C0" offset="93.8%"/></linearGradient><linearGradient x1="26.648%" y1="2.735%" x2="77.654%" y2="105.978%" id="ssvg-id-1st-place-medalk"><stop stop-color="#64B5F6" offset="13.55%"/><stop stop-color="#2196F3" offset="94.62%"/></linearGradient><radialGradient cx="22.368%" cy="12.5%" fx="22.368%" fy="12.5%" r="95.496%" id="ssvg-id-1st-place-medalo"><stop stop-color="#FFEB3B" offset="29.72%"/><stop stop-color="#FBC02D" offset="95.44%"/></radialGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalc" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medala"/></mask><path fill="url(#ssvg-id-1st-place-medalb)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalc)" d="M45.44 42.18h31.43l30-48.43H75.44z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medale" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medald"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medale)" fill="#424242" fill-rule="nonzero"><path d="M101.23-3L75.2 39H50.85L77.11-3h24.12zm5.64-3H75.44l-30 48h31.42l30.01-48z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medalg" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalf"/></mask><path d="M79 30H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z" fill="#FDD835" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medalg)"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medali" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalh"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medali)" fill="#424242" fill-rule="nonzero"><path d="M79 32c3.31 0 6 2.69 6 6v16.04A2.006 2.006 0 0 1 82.59 56c-1.18-.23-2.59-1.35-2.59-2.07V44c0-2.21-1.79-4-4-4H46c-2.21 0-4 1.79-4 4v10.04c0 .88-1.64 1.96-2.97 1.96c-1.12-.01-2.03-.89-2.03-1.96V38c0-3.31 2.69-6 6-6h36zm0-2H43c-4.42 0-8 3.58-8 8v16.04c0 2.17 1.8 3.95 4.02 3.96h.01c2.23-.01 4.97-1.75 4.97-3.96V44c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v9.93c0 1.98 2.35 3.68 4.22 4.04c.26.05.52.08.78.08c2.21 0 4-1.79 4-4V38c0-4.42-3.58-8-8-8z"/></g></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medall" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalj"/></mask><path fill="url(#ssvg-id-1st-place-medalk)" fill-rule="nonzero" mask="url(#ssvg-id-1st-place-medall)" d="M76.87 42.18H45.44l-30-48.43h31.43z"/></g><g transform="translate(3 4)"><mask id="ssvg-id-1st-place-medaln" fill="#fff"><use xlink:href="#ssvg-id-1st-place-medalm"/></mask><g opacity=".2" mask="url(#ssvg-id-1st-place-medaln)" fill="#424242" fill-rule="nonzero"><path d="M45.1-3l26.35 42H47.1L20.86-3H45.1zm1.77-3H15.44l30 48h31.42L46.87-6z"/></g></g><circle fill="url(#ssvg-id-1st-place-medalo)" fill-rule="nonzero" cx="64" cy="86" r="38"/><path d="M64 51c19.3 0 35 15.7 35 35s-15.7 35-35 35s-35-15.7-35-35s15.7-35 35-35zm0-3c-20.99 0-38 17.01-38 38s17.01 38 38 38s38-17.01 38-38s-17.01-38-38-38z" opacity=".2" fill="#424242" fill-rule="nonzero"/><path d="M47.3 63.59h33.4v44.4H47.3z"/><use fill="#000" xlink:href="#ssvg-id-1st-place-medalp"/><use fill="#FFA000" xlink:href="#ssvg-id-1st-place-medalp"/></g>',
	width: 128,
	height: 128,
};

describe('Creating component', () => {
	test('basic icon', () => {
		const component = renderer.create(<Icon icon={iconData} />);
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

	test('using storage', () => {
		addIcon('test-icon', iconData);
		const component = renderer.create(<Icon icon="test-icon" />);
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

	test('using storage with icon set', () => {
		const iconSet = {
			prefix: 'mdi-light',
			icons: {
				account: {
					body:
						'<path d="M11.5 14c4.142 0 7.5 1.567 7.5 3.5V20H4v-2.5c0-1.933 3.358-3.5 7.5-3.5zm6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S5 16.12 5 17.5V19h13v-1.5zM11.5 5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5z" fill="currentColor"/>',
				},
				home: {
					body:
						'<path d="M16 8.414l-4.5-4.5L4.414 11H6v8h3v-6h5v6h3v-8h1.586L17 9.414V6h-1v2.414zM2 12l9.5-9.5L15 6V5h3v4l3 3h-3v7.998h-5v-6h-3v6H5V12H2z" fill="currentColor"/>',
				},
			},
			width: 24,
			height: 24,
		};

		addCollection(iconSet);
		const component = renderer.create(<Icon icon="mdi-light:account" />);
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
					__html: iconSet.icons.account.body,
				},
				'width': '1em',
				'height': '1em',
				'preserveAspectRatio': 'xMidYMid meet',
				'viewBox': '0 0 ' + iconSet.width + ' ' + iconSet.height,
			},
			children: null,
		});
	});

	test('using storage with icon set with custom prefix', () => {
		const iconSet = {
			prefix: 'mdi-light',
			icons: {
				'account-alert': {
					body:
						'<path d="M10.5 14c4.142 0 7.5 1.567 7.5 3.5V20H3v-2.5c0-1.933 3.358-3.5 7.5-3.5zm6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S4 16.12 4 17.5V19h13v-1.5zM10.5 5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM20 16v-1h1v1h-1zm0-3V7h1v6h-1z" fill="currentColor"/>',
				},
				'link': {
					body:
						'<path d="M8 13v-1h7v1H8zm7.5-6a5.5 5.5 0 1 1 0 11H13v-1h2.5a4.5 4.5 0 1 0 0-9H13V7h2.5zm-8 11a5.5 5.5 0 1 1 0-11H10v1H7.5a4.5 4.5 0 1 0 0 9H10v1H7.5z" fill="currentColor"/>',
				},
			},
			width: 24,
			height: 24,
		};

		addCollection(iconSet, 'custom-');
		const component = renderer.create(<Icon icon="custom-link" />);
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
					__html: iconSet.icons.link.body,
				},
				'width': '1em',
				'height': '1em',
				'preserveAspectRatio': 'xMidYMid meet',
				'viewBox': '0 0 ' + iconSet.width + ' ' + iconSet.height,
			},
			children: null,
		});
	});

	test('missing icon from storage', () => {
		const component = renderer.create(<Icon icon="missing-icon" />);
		const tree = component.toJSON();

		expect(tree).toStrictEqual(null);
	});

	test('replacing id', () => {
		const component = renderer.create(<Icon icon={iconDataWithID} />);
		const tree = component.toJSON();
		const body = tree.props.dangerouslySetInnerHTML.__html;

		expect(body).not.toStrictEqual(iconDataWithID.body);
	});
});

describe('Passing attributes', () => {
	test('title', () => {
		const component = renderer.create(
			<Icon icon={iconData} title="Icon!" />
		);
		const tree = component.toJSON();

		expect(tree.props.title).toStrictEqual('Icon!');
	});

	test('aria-hidden', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} aria-hidden="false" />
		);
		const tree = component.toJSON();

		expect(tree.props['aria-hidden']).toStrictEqual(void 0);
	});

	test('ariaHidden', () => {
		const component = renderer.create(
			<InlineIcon icon={iconData} ariaHidden="false" />
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

		expect(tree.props.style).toMatchObject({
			color: 'red',
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
