import React from 'react';
import { Icon, InlineIcon, addIcon, addCollection } from '@iconify/react';
import accountIcon from '@iconify-icons/mdi-light/account';
import alertIcon from '@iconify-icons/mdi-light/alert';
import homeIcon from '@iconify-icons/mdi-light/home';
import presentationPlay from '@iconify-icons/mdi-light/presentation-play';
import checkedIcon from '@iconify-icons/uil/check-circle';
import uncheckedIcon from '@iconify-icons/uil/circle';

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

// Add icon with id: noto:robot
addIcon('noto-robot', {
	body:
		'<path d="M12.53 53.05c-4.57.01-8.28 3.72-8.28 8.29v38.38a8.297 8.297 0 0 0 8.28 8.28h5.55V53l-5.55.05z" fill="#c62828"/><path d="M115.72 53.05c4.57.01 8.28 3.72 8.28 8.29v38.38c-.01 4.57-3.71 8.28-8.28 8.29h-5.55v-55l5.55.04z" fill="#c62828"/><path d="M113.17 54.41l-.12-10c-.03-4.3-3.53-7.77-7.83-7.75H67.05V23.25c5.11-1.69 7.89-7.2 6.2-12.31c-1.69-5.11-7.2-7.89-12.31-6.2s-7.89 7.2-6.2 12.31a9.743 9.743 0 0 0 6.2 6.2v13.46H22.78c-4.28.01-7.75 3.47-7.78 7.75v71.78c.03 4.28 3.5 7.74 7.78 7.76h82.44c4.3.01 7.8-3.46 7.83-7.76v-7.37h.12V54.41z" fill="#90a4ae"/><path d="M64 18c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4z" fill="#c62828"/><g><linearGradient id="ssvg-id-robota" gradientUnits="userSpaceOnUse" x1="64.005" y1="22.44" x2="64.005" y2="35.55" gradientTransform="matrix(1 0 0 -1 0 130)"><stop offset=".12" stop-color="#e0e0e0"/><stop offset=".52" stop-color="#fff"/><stop offset="1" stop-color="#eaeaea"/></linearGradient><path d="M44.15 94.45h39.71c3.46 0 6.27 2.81 6.27 6.27v.57c0 3.46-2.81 6.27-6.27 6.27H44.15c-3.46 0-6.27-2.81-6.27-6.27v-.57c0-3.46 2.81-6.27 6.27-6.27z" fill="url(#ssvg-id-robota)"/><linearGradient id="ssvg-id-robotb" gradientUnits="userSpaceOnUse" x1="54.85" y1="22.44" x2="54.85" y2="35.53" gradientTransform="matrix(1 0 0 -1 0 130)"><stop offset="0" stop-color="#333"/><stop offset=".55" stop-color="#666"/><stop offset="1" stop-color="#333"/></linearGradient><path fill="url(#ssvg-id-robotb)" d="M53.67 94.47h2.36v13.09h-2.36z"/><linearGradient id="ssvg-id-robotc" gradientUnits="userSpaceOnUse" x1="64.06" y1="22.44" x2="64.06" y2="35.53" gradientTransform="matrix(1 0 0 -1 0 130)"><stop offset="0" stop-color="#333"/><stop offset=".55" stop-color="#666"/><stop offset="1" stop-color="#333"/></linearGradient><path fill="url(#ssvg-id-robotc)" d="M62.88 94.47h2.36v13.09h-2.36z"/><linearGradient id="ssvg-id-robotd" gradientUnits="userSpaceOnUse" x1="73.15" y1="22.44" x2="73.15" y2="35.53" gradientTransform="matrix(1 0 0 -1 0 130)"><stop offset="0" stop-color="#333"/><stop offset=".55" stop-color="#666"/><stop offset="1" stop-color="#333"/></linearGradient><path fill="url(#ssvg-id-robotd)" d="M71.97 94.47h2.36v13.09h-2.36z"/><linearGradient id="ssvg-id-robote" gradientUnits="userSpaceOnUse" x1="82.8" y1="22.44" x2="82.8" y2="35.53" gradientTransform="matrix(1 0 0 -1 0 130)"><stop offset="0" stop-color="#333"/><stop offset=".55" stop-color="#666"/><stop offset="1" stop-color="#333"/></linearGradient><path fill="url(#ssvg-id-robote)" d="M81.62 94.47h2.36v13.09h-2.36z"/><linearGradient id="ssvg-id-robotf" gradientUnits="userSpaceOnUse" x1="45.2" y1="22.46" x2="45.2" y2="35.55" gradientTransform="matrix(1 0 0 -1 0 130)"><stop offset="0" stop-color="#333"/><stop offset=".55" stop-color="#666"/><stop offset="1" stop-color="#333"/></linearGradient><path fill="url(#ssvg-id-robotf)" d="M44.02 94.45h2.36v13.09h-2.36z"/><g><path d="M64 85.33h-5.33c-.55 0-1-.45-1-1c0-.16.04-.31.11-.45l2.74-5.41l2.59-4.78a.996.996 0 0 1 1.76 0l2.61 5l2.71 5.19c.25.49.06 1.09-.43 1.35c-.14.07-.29.11-.45.11L64 85.33z" fill="#c62828"/></g><g><radialGradient id="ssvg-id-robotg" cx="42.64" cy="63.19" r="11.5" gradientTransform="matrix(1 0 0 -1 0 130)" gradientUnits="userSpaceOnUse"><stop offset=".48" stop-color="#fff"/><stop offset=".77" stop-color="#fdfdfd"/><stop offset=".88" stop-color="#f6f6f6"/><stop offset=".96" stop-color="#ebebeb"/><stop offset="1" stop-color="#e0e0e0"/></radialGradient><circle cx="42.64" cy="66.81" r="11.5" fill="url(#ssvg-id-robotg)"/><linearGradient id="ssvg-id-roboth" gradientUnits="userSpaceOnUse" x1="30.14" y1="63.19" x2="55.14" y2="63.19" gradientTransform="matrix(1 0 0 -1 0 130)"><stop offset="0" stop-color="#333"/><stop offset=".55" stop-color="#666"/><stop offset="1" stop-color="#333"/></linearGradient><circle cx="42.64" cy="66.81" r="11.5" fill="none" stroke="url(#ssvg-id-roboth)" stroke-width="2" stroke-miterlimit="10"/><radialGradient id="ssvg-id-roboti" cx="84.95" cy="63.22" r="11.5" gradientTransform="matrix(1 0 0 -1 0 130)" gradientUnits="userSpaceOnUse"><stop offset=".48" stop-color="#fff"/><stop offset=".77" stop-color="#fdfdfd"/><stop offset=".88" stop-color="#f6f6f6"/><stop offset=".96" stop-color="#ebebeb"/><stop offset="1" stop-color="#e0e0e0"/></radialGradient><path d="M85 55.28c-6.35 0-11.5 5.15-11.5 11.5s5.15 11.5 11.5 11.5s11.5-5.15 11.5-11.5c-.01-6.35-5.15-11.49-11.5-11.5z" fill="url(#ssvg-id-roboti)"/><linearGradient id="ssvg-id-robotj" gradientUnits="userSpaceOnUse" x1="72.45" y1="63.22" x2="97.45" y2="63.22" gradientTransform="matrix(1 0 0 -1 0 130)"><stop offset="0" stop-color="#333"/><stop offset=".55" stop-color="#666"/><stop offset="1" stop-color="#333"/></linearGradient><path d="M85 55.28c-6.35 0-11.5 5.15-11.5 11.5s5.15 11.5 11.5 11.5s11.5-5.15 11.5-11.5h0c-.01-6.35-5.15-11.49-11.5-11.5z" fill="none" stroke="url(#ssvg-id-robotj)" stroke-width="2" stroke-miterlimit="10"/></g></g>',
	width: 128,
	height: 128,
});

// Add few mdi-light: icons
addCollection({
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
				<div>
					2 icons imported from icon set:{' '}
					<Icon icon="mdi-light:account-alert" />
					<Icon icon="mdi-light:link" />
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
				<p>
					Testing reference by adding border to icon:{' '}
					<Icon
						icon="demo"
						ref={(element) => {
							element.style.border = '1px solid red';
						}}
					/>
				</p>
				<p>
					Testing replacing ids in icons: <Icon icon="noto-robot" />
					<Icon icon="noto-robot" hFlip={true} />
				</p>
			</section>

			<InlineDemo />
		</div>
	);
}

export default App;
