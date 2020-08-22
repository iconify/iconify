import React from 'react';
import { Icon, InlineIcon, enableCache } from '@iconify/react-with-api';
import accountIcon from '@iconify-icons/mdi-light/account';
import homeIcon from '@iconify-icons/mdi-light/home';

import { Checkbox } from './components/Checkbox';
import { InlineDemo } from './components/Inline';

import './App.css';

// Disable cache for test
enableCache('local', false);
enableCache('session', false);

class CheckboxIcon extends React.Component {
	constructor(props) {
		super();
		this.state = {
			checked: props.checked,
		};
		this._check = this._check.bind(this);
	}

	render() {
		const checked = this.state.checked;
		const icon = checked ? 'uil:check-circle' : 'uil:circle';
		const color = checked ? 'green' : 'red';
		return (
			<InlineIcon
				icon={icon}
				onClick={this._check}
				style={{ cursor: 'pointer', color }}
			/>
		);
	}

	_check(event) {
		event.preventDefault();
		this.setState({
			checked: !this.state.checked,
		});
	}
}

function App() {
	return (
		<div className="App">
			<section className="icon-24">
				<h1>Usage</h1>
				<div>
					Empty icon: <Icon />
				</div>
				<div>
					Icon referenced by name:{' '}
					<Icon icon="mdi-light:presentation-play" />
				</div>
				<div>
					Icon referenced by object: <Icon icon={accountIcon} />
				</div>
				<div className="alert">
					<Icon icon="mdi-light:alert" />
					Important notice with alert icon!
				</div>
			</section>

			<section>
				<h1>Checkbox</h1>
				<div>
					<Checkbox
						checked={true}
						text="Checkbox example"
						hint="(click to toggle)"
					/>
					<Checkbox
						checked={false}
						text="Another checkbox example"
						hint="(click to toggle)"
					/>
				</div>
			</section>

			<section>
				<h1>Tests</h1>
				<p>
					<Icon
						icon={homeIcon}
						style={{
							color: '#1769aa',
							fontSize: '24px',
							lineHeight: '1em',
							verticalAlign: '-0.25em',
						}}
					/>
					Home icon! 24px icon in 16px text with 24px line height,
					aligned using inline style.
				</p>
				<p>
					Clickable icon (testing events and style): <CheckboxIcon />
				</p>
				<p>
					Colored icons (block, inline, block):
					<InlineIcon
						icon="mdi-light:alert"
						style={{
							fontSize: '1.5em',
							verticalAlign: 0,
							marginLeft: '8px',
						}}
						color="green"
					/>
					<InlineIcon
						icon="mdi-light:alert"
						style={{
							fontSize: '1.5em',
							color: 'red',
							marginLeft: '8px',
						}}
					/>
					<Icon
						icon="mdi-light:alert"
						style={{
							fontSize: '1.5em',
							color: 'purple',
							marginLeft: '8px',
						}}
					/>
				</p>
			</section>

			<InlineDemo />
		</div>
	);
}

export default App;
