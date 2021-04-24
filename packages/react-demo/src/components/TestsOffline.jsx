import React from 'react';
import { InlineIcon } from '@iconify/react/dist/offline';
import { TestIcon } from './TestIcon';

export class TestsOffline extends React.Component {
	constructor(props) {
		super();

		const state = {
			ref_missing: 'default-success',
		};
		this.state = state;
	}

	render() {
		const state = this.state;
		const success = this._toggle.bind(this, 'success');
		const fail = this._toggle.bind(this, 'fail');
		return (
			<section className="tests">
				<h1>Tests (offline module)</h1>

				<h2>References</h2>

				<div className="test-row">
					<TestIcon status={state.ref} />
					<span>
						Getting reference
						<InlineIcon
							icon="demo"
							ref={(element) => {
								const key = 'ref';
								if (element && element.tagName === 'svg') {
									success(key);
								} else {
									fail(key);
								}
							}}
						/>
					</span>
				</div>

				<div className="test-row">
					<TestIcon status={state.ref_missing} />
					<span>
						Getting reference for empty icon
						<InlineIcon
							ref={(element) => {
								// Cannot be called because there is no SVG to render!
								fail('ref_missing');
							}}
						/>
					</span>
				</div>

				<div className="test-row">
					<TestIcon status={state.ref_missing} />
					<span>
						Getting reference for missing icon with fallback text{' '}
						<InlineIcon
							ref={(element) => {
								// Cannot be called because there is no SVG to render!
								fail('ref_missing');
							}}
						>
							😀
						</InlineIcon>
					</span>
				</div>

				<h2>Style</h2>

				<div className="test-row">
					<TestIcon status={state.style} />
					<span>
						Inline style for icon
						<InlineIcon
							icon="demo"
							style={{
								color: '#1769aa',
								fontSize: '24px',
								lineHeight: '1em',
								verticalAlign: '-0.25em',
							}}
							ref={(element) => {
								const key = 'style';
								if (element && element.tagName === 'svg') {
									let errors = false;

									// Get style
									const style = element.style;

									switch (style.color.toLowerCase()) {
										case 'rgb(23, 105, 170)':
										case '#1769aa':
											break;

										default:
											console.log(
												'Invalid color:',
												style.color
											);
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

									if (errors) {
										fail(key);
									} else {
										success(key);
									}
								} else {
									fail(key);
								}
							}}
						/>
					</span>
				</div>

				<div className="test-row">
					<TestIcon status={state.color1} />
					<span>
						Green color from attribute:{' '}
						<InlineIcon
							icon="demo"
							color="green"
							ref={(element) => {
								const key = 'color1';
								if (element && element.tagName === 'svg') {
									let errors = false;

									// Get style
									const style = element.style;

									switch (style.color.toLowerCase()) {
										case 'rgb(0, 128, 0)':
										case '#008000':
										case 'green':
											break;

										default:
											console.log(
												'Invalid color:',
												style.color
											);
											errors = true;
									}

									if (errors) {
										fail(key);
									} else {
										success(key);
									}
								} else {
									fail(key);
								}
							}}
						/>
					</span>
				</div>

				<div className="test-row">
					<TestIcon status={state.color2} />
					<span>
						Green color from style:{' '}
						<InlineIcon
							icon="demo"
							style={{
								color: 'green',
							}}
							ref={(element) => {
								const key = 'color2';
								if (element && element.tagName === 'svg') {
									let errors = false;

									// Get style
									const style = element.style;

									switch (style.color.toLowerCase()) {
										case 'rgb(0, 128, 0)':
										case '#008000':
										case 'green':
											break;

										default:
											console.log(
												'Invalid color:',
												style.color
											);
											errors = true;
									}

									if (errors) {
										fail(key);
									} else {
										success(key);
									}
								} else {
									fail(key);
								}
							}}
						/>
					</span>
				</div>

				<div className="test-row">
					<TestIcon status={state.color3} />
					<span>
						Green color from attribute (overrides style) + red from
						style:{' '}
						<InlineIcon
							icon="demo"
							color="green"
							style={{
								color: 'red',
							}}
							ref={(element) => {
								const key = 'color3';
								if (element && element.tagName === 'svg') {
									let errors = false;

									// Get style
									const style = element.style;

									switch (style.color.toLowerCase()) {
										case 'rgb(0, 128, 0)':
										case '#008000':
										case 'green':
											break;

										default:
											console.log(
												'Invalid color:',
												style.color
											);
											errors = true;
									}

									if (errors) {
										fail(key);
									} else {
										success(key);
									}
								} else {
									fail(key);
								}
							}}
						/>
					</span>
				</div>
			</section>
		);
	}

	_toggle(value, key) {
		setTimeout(() => {
			const oldValue = this.state[key];
			if (
				oldValue === value ||
				oldValue === 'success' ||
				oldValue === 'fail'
			) {
				return;
			}
			this.setState({
				[key]: value,
			});
		});
	}
}
