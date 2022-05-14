import React from 'react';
import { Icon } from '@iconify-icon/react';
import successIcon from '@iconify-icons/uil/check-circle';
import pendingIcon from '@iconify-icons/uil/question-circle';
import failedIcon from '@iconify-icons/uil/times-circle';

type StatusIcon = 'success' | 'failed' | 'pending';

interface TestIconsProps {
	id: string;
	icon?: StatusIcon;
}

export function Tests(props: TestIconsProps) {
	const id = 'test-icons-' + props.id;
	const icon = props.icon || 'pending';

	return (
		<span className="test-row-icons" id={id}>
			<Icon
				icon={successIcon}
				inline={true}
				className={
					'success ' + (icon === 'success' ? 'visible' : 'hidden')
				}
			/>
			<Icon
				icon={pendingIcon}
				inline={true}
				className={
					'pending ' + (icon === 'pending' ? 'visible' : 'hidden')
				}
			/>
			<Icon
				icon={failedIcon}
				inline={true}
				className={
					'failed ' + (icon === 'failed' ? 'visible' : 'hidden')
				}
			/>
		</span>
	);
}

export function toggleTest(id: string, status: StatusIcon) {
	const node = document.getElementById('test-icons-' + id);
	if (!node) {
		return;
	}

	// Remove previous status
	const visible = node.querySelector('.visible');
	if (visible) {
		visible.classList.remove('visible');
		visible.classList.add('hidden');
	}

	// Show new icon
	const toggle = node.querySelector('.' + status);
	if (toggle) {
		toggle.classList.remove('hidden');
		toggle.classList.add('visible');
	}
}
