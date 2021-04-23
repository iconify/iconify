import React from 'react';
import { Icon } from '@iconify/react';
import checkedIcon from '@iconify-icons/uil/check-circle';
import uncheckedIcon from '@iconify-icons/uil/circle';

export class Checkbox extends React.Component {
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
		const className =
			'checkbox checkbox--' + (checked ? 'checked' : 'unchecked');

		return (
			<div className="checkbox-container">
				<a href="# " className={className} onClick={this._check}>
					<Icon icon={icon} />
					{this.props.text}
				</a>
				<small>{this.props.hint}</small>
			</div>
		);
	}

	_check(event) {
		event.preventDefault();
		this.setState({
			checked: !this.state.checked,
		});
	}
}
