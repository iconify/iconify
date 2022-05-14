import React from 'react';
import { Icon } from '@iconify-icon/react';
import { Tests, toggleTest } from './Tests';

export function TestIcon() {
	return (
		<section className="tests">
			<h1>Tests (offline module)</h1>

			<h2>References</h2>

			<div className="test-row">
				<Tests id="offline-ref1" />
				Getting reference
				<Icon
					icon="demo"
					inline
					ref={(element) => {
						const key = 'offline-ref1';
						if (element?.tagName.toLowerCase() === 'iconify-icon') {
							toggleTest(key, 'success');
						} else {
							toggleTest(key, 'failed');
						}
					}}
				/>
			</div>

			<h2>Style</h2>

			<div className="test-row">
				<Tests id="offline-style" />
				Inline style for icon
				<Icon
					icon="demo"
					style={{
						color: '#1769aa',
						fontSize: '24px',
						lineHeight: '1em',
						verticalAlign: '-0.25em',
					}}
					ref={(element) => {
						const key = 'offline-style';
						if (element) {
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
				<Tests id="offline-color2" />
				Green color from style:{' '}
				<Icon
					icon="demo"
					style={{
						color: 'green',
					}}
					ref={(element) => {
						const key = 'offline-color2';
						if (element) {
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

			<h2>Properties</h2>

			<div className="test-row">
				<Tests id="icon-rotate2" />
				Rotation as number:{' '}
				<Icon
					icon="demo"
					rotate={2}
					inline
					ref={(element) => {
						const key = 'icon-rotate2';
						if (element) {
							toggleTest(
								key,
								element.getAttribute('rotate') !== '2'
									? 'failed'
									: 'success'
							);
						} else {
							toggleTest(key, 'failed');
						}
					}}
				/>
				<Icon icon="demo" rotate="180deg" inline />
			</div>
		</section>
	);
}
