import React from 'react';
import { Icon, InlineIcon, addIcon } from '@iconify/react';
import accountIcon from '@iconify/icons-mdi-light/account';
import alertIcon from '@iconify/icons-mdi-light/alert';
import homeIcon from '@iconify/icons-mdi-light/home';
import presentationPlay from '@iconify/icons-mdi-light/presentation-play';
import checkedIcon from '@iconify/icons-uil/check-circle';
import uncheckedIcon from '@iconify/icons-uil/circle';

import { Checkbox } from './components/Checkbox';
import { InlineDemo } from './components/Inline';

import './App.css';

// Add 'mdi-light:presentation-play' as 'demo'
addIcon('demo', presentationPlay);

// Add custom icon as 'experiment'
addIcon('experiment2', {
	width: 16,
	height: 16,
	body:
		'<circle fill-opacity="0.2" cx="8" cy="8" r="7" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill="currentColor"/><path d="M7 9L5 7L3.5 8.5L7 12L13 6L11.5 4.5L7 9Z" fill="currentColor"/>',
});

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
		const icon = checked ? checkedIcon : uncheckedIcon;
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
					Icon referenced by name: <Icon icon="demo" />
				</div>
				<div>
					Icon referenced by object: <Icon icon={accountIcon} />
				</div>
				<div className="alert">
					<Icon icon={alertIcon} />
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
						icon={alertIcon}
						style={{
							fontSize: '1.5em',
							verticalAlign: 0,
							marginLeft: '8px',
						}}
						color="green"
					/>
					<InlineIcon
						icon={alertIcon}
						style={{
							fontSize: '1.5em',
							color: 'red',
							marginLeft: '8px',
						}}
					/>
					<Icon
						icon={alertIcon}
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
