import { useState } from 'react';
import { Icon } from '@iconify-icon/react';
import checkedIcon from '@iconify-icons/uil/check-square';
import uncheckedIcon from '@iconify-icons/uil/square';

interface CheckboxProps {
	checked: boolean;
	text: string;
	hint: string;
}

export function Checkbox(props: CheckboxProps) {
	const [checked, setChecked] = useState(props.checked);

	function onClick(event: React.MouseEvent<HTMLElement>) {
		event.preventDefault();
		setChecked((value) => !value);
	}

	return (
		<div className="checkbox-container">
			<a
				href="# "
				className={
					'checkbox ' +
					(checked ? 'checkbox--checked' : 'checkbox--unchecked')
				}
				onClick={onClick}
			>
				<Icon
					icon={checked ? checkedIcon : uncheckedIcon}
					mode={checked ? 'mask' : 'svg'}
				/>
				{props.text}
			</a>
			<small>{props.hint}</small>
		</div>
	);
}
