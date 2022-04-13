import React from 'react';
import { InlineIcon } from '@iconify/react/dist/offline';
import successIcon from '@iconify-icons/uil/check-circle';
import pendingIcon from '@iconify-icons/uil/question-circle';
import failedIcon from '@iconify-icons/uil/times-circle';

type StatusIcon = 'success' | 'failed' | 'pending';

interface TestIconsProps {
	id: string;
	icon?: StatusIcon;
}

export function TestIcons(props: TestIconsProps) {
	const id = 'test-icons-' + props.id;
	const icon = props.icon || 'pending';

	return (
		<span className="test-row-icons" id={id}>
			<InlineIcon
				icon={successIcon}
				mode="style"
				className={
					'success ' + (icon === 'success' ? 'visible' : 'hidden')
				}
			/>
			<InlineIcon
				icon={pendingIcon}
				mode="style"
				className={
					'pending ' + (icon === 'pending' ? 'visible' : 'hidden')
				}
			/>
			<InlineIcon
				icon={failedIcon}
				mode="style"
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
