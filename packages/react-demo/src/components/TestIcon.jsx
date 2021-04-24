import React from 'react';
import { InlineIcon } from '@iconify/react/dist/offline';
import successIcon from '@iconify-icons/uil/check-circle';
import pendingIcon from '@iconify-icons/uil/question-circle';
import failedIcon from '@iconify-icons/uil/times-circle';

export function TestIcon(props) {
	let icon = pendingIcon;
	let className = '';

	switch (props.status) {
		case 'success':
		case 'default-success':
		case true:
			icon = successIcon;
			className = 'success';
			break;

		case 'fail':
		case false:
			icon = failedIcon;
			className = 'fail';
			break;

		default:
	}

	return <InlineIcon icon={icon} className={className} />;
}
