import React from 'react';
import { InlineIcon, addAPIProvider, _api } from '@iconify/react';
import { mockAPIModule, mockAPIData } from '@iconify/core/lib/api/modules/mock';
import { TestIcons, toggleTest } from './TestIcons';
import playIcon from '@iconify-icons/mdi-light/map-marker';

// API provider for tests
const provider = 'mock-api';
const prefix = 'demo';

// Set API module for provider
addAPIProvider(provider, {
	resources: ['http://localhost'],
	rotate: 10000,
	timeout: 10000,
});
_api.setAPIModule(provider, mockAPIModule);

// Set mock data
mockAPIData({
	type: 'icons',
	provider,
	prefix,
	response: {
		prefix,
		icons: {
			icon: playIcon,
		},
	},
	delay: 2000,
});

export function TestsFull() {
	const icon = `@${provider}:${prefix}:icon`;

	return (
		<section className="tests">
			<h1>Tests (full module, with API)</h1>

			<h2>References</h2>

			<p>Icons should load 2 seconds after page load</p>

			<div className="test-row">
				<TestIcons id="full-ref1" />
				Getting reference
				<InlineIcon
					icon={icon}
					ref={(element) => {
						const key = 'full-ref1';
						if (element?.tagName === 'svg') {
							toggleTest(key, 'success');
						} else {
							toggleTest(key, 'failed');
						}
					}}
				/>
			</div>

			<div className="test-row">
				<TestIcons id="full-ref-missing" icon="success" />
				Getting reference for empty icon
				<InlineIcon
					icon=""
					ref={() => {
						// Cannot be called because there is no SVG to render!
						toggleTest('full-ref-missing', 'failed');
					}}
				/>
			</div>

			<div className="test-row">
				<TestIcons id="full-ref-missing2" icon="success" />
				Getting reference for missing icon with fallback text{' '}
				<InlineIcon
					icon="invalid"
					ref={() => {
						// Cannot be called because there is no SVG to render!
						toggleTest('full-ref-missing2', 'failed');
					}}
				>
					😀
				</InlineIcon>
			</div>

			<h2>Style</h2>

			<div className="test-row">
				<TestIcons id="full-style" />
				Inline style for icon
				<InlineIcon
					icon={icon}
					style={{
						color: '#1769aa',
						fontSize: '24px',
						lineHeight: '1em',
						verticalAlign: '-0.25em',
					}}
					ref={(element) => {
						const key = 'full-style';
						if (element?.tagName === 'svg') {
							let errors = false;

							// Get style
							const style = element.style;

							switch (style.color.toLowerCase()) {
								case 'rgb(23, 105, 170)':
								case '#1769aa':
									break;

								default:
									console.log('Invalid color:', style.color);
									errors = true;
							}

							if (style.fontSize !== '24px') {
								console.log(
									'Invalid font-size:',
									style.fontSize
								);
								errors = true;
							}

							if (style.verticalAlign !== '-0.25em') {
								console.log(
									'Invalid vertical-align:',
									style.verticalAlign
								);
								errors = true;
							}

							toggleTest(key, errors ? 'failed' : 'success');
						} else {
							toggleTest(key, 'failed');
						}
					}}
				/>
			</div>

			<div className="test-row">
				<TestIcons id="full-color1" />
				Green color from attribute:{' '}
				<InlineIcon
					icon={icon}
					color="green"
					ref={(element) => {
						const key = 'full-color1';
						if (element?.tagName === 'svg') {
							let errors = false;

							// Get style
							const style = element.style;

							switch (style.color.toLowerCase()) {
								case 'rgb(0, 128, 0)':
								case '#008000':
								case 'green':
									break;

								default:
									console.log('Invalid color:', style.color);
									errors = true;
							}

							toggleTest(key, errors ? 'failed' : 'success');
						} else {
							toggleTest(key, 'failed');
						}
					}}
				/>
			</div>

			<div className="test-row">
				<TestIcons id="full-color2" />
				Green color from style:{' '}
				<InlineIcon
					icon={icon}
					style={{
						color: 'green',
					}}
					ref={(element) => {
						const key = 'full-color2';
						if (element?.tagName === 'svg') {
							let errors = false;

							// Get style
							const style = element.style;

							switch (style.color.toLowerCase()) {
								case 'rgb(0, 128, 0)':
								case '#008000':
								case 'green':
									break;

								default:
									console.log('Invalid color:', style.color);
									errors = true;
							}

							toggleTest(key, errors ? 'failed' : 'success');
						} else {
							toggleTest(key, 'failed');
						}
					}}
				/>
			</div>

			<div className="test-row">
				<TestIcons id="full-color3" />
				Red color from attribute + green from style (style overrides
				attribute):{' '}
				<InlineIcon
					icon={icon}
					color="red"
					style={{
						color: 'green',
					}}
					ref={(element) => {
						const key = 'full-color3';
						if (element?.tagName === 'svg') {
							let errors = false;

							// Get style
							const style = element.style;

							switch (style.color.toLowerCase()) {
								case 'rgb(0, 128, 0)':
								case '#008000':
								case 'green':
									break;

								default:
									console.log('Invalid color:', style.color);
									errors = true;
							}

							toggleTest(key, errors ? 'failed' : 'success');
						} else {
							toggleTest(key, 'failed');
						}
					}}
				/>
			</div>
		</section>
	);
}
