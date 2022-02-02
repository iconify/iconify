import { useState } from 'react';
import { Icon } from '@iconify/react/dist/offline';
import checkedIcon from '@iconify-icons/uil/check-square';
import uncheckedIcon from '@iconify-icons/uil/square';

interface CheckboxProps {
	checked: boolean;
	text: string;
	hint: string;
}

export function Checkbox(props: CheckboxProps) {
	const [checked, setChecked] = useState(props.checked);

	return (
		<div className="checkbox-container">
			<a
				href="# "
				className={
					'checkbox ' +
					(checked ? 'checkbox--checked' : 'checkbox--unchecked')
				}
				onClick={() => setChecked((value) => !value)}
			>
				<Icon icon={checked ? checkedIcon : uncheckedIcon} />
				{props.text}
			</a>
			<small>{props.hint}</small>
		</div>
	);
}
