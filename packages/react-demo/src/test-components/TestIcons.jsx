import React from 'react';
import { InlineIcon } from '@iconify/react/dist/offline';
import successIcon from '@iconify-icons/uil/check-circle';
import pendingIcon from '@iconify-icons/uil/question-circle';
import failedIcon from '@iconify-icons/uil/times-circle';

function getStatus(status) {
	switch (status) {
		case 'success':
		case 'default-success':
		case true:
			return 'success';

		case 'failed':
		case 'fail':
		case false:
			return 'failed';

		default:
			return 'pending';
	}
}

export function TestIcons(props) {
	if (!props.id) {
		return null;
	}

	const id = 'test-icons-' + props.id;
	const icon = getStatus(props.status);

	return (
		<span className="test-row-icons" id={id}>
			<InlineIcon
				icon={successIcon}
				className={
					'success ' + (icon === 'success' ? 'visible' : 'hidden')
				}
			/>
			<InlineIcon
				icon={pendingIcon}
				className={
					'pending ' + (icon === 'pending' ? 'visible' : 'hidden')
				}
			/>
			<InlineIcon
				icon={failedIcon}
				className={
					'failed ' + (icon === 'failed' ? 'visible' : 'hidden')
				}
			/>
		</span>
	);
}

export function toggleTest(id, status) {
	const node = document.getElementById('test-icons-' + id);
	if (!node) {
		return;
	}

	// Get icon to show
	const icon = getStatus(status);

	// Remove previous status
	const visible = node.querySelector('.visible');
	if (visible) {
		visible.classList.remove('visible');
		visible.classList.add('hidden');
	}

	// Show new icon
	const toggle = node.querySelector('.' + icon);
	if (toggle) {
		toggle.classList.remove('hidden');
		toggle.classList.add('visible');
	}
}
