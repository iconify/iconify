import React from 'react';
import { Icon } from '@iconify/react/dist/offline';
import accountIcon from '@iconify-icons/mdi-light/account';
import alertIcon from '@iconify-icons/mdi-light/alert';

export function OfflineUsageDemo() {
	return (
		<section className="icon-24">
			<h1>Usage (offline module)</h1>
			<div>
				Icons referenced by name (as SVG, as SPAN): <Icon icon="demo" />
				<Icon icon="demo" mode="style" />
			</div>
			<div>
				Icons referenced by object (as SVG, as SPAN):{' '}
				<Icon icon={accountIcon} />{' '}
				<Icon icon={accountIcon} mode="style" />
			</div>
			<div>
				2 icons imported from icon set:{' '}
				<Icon icon="offline-mdi-light:account-alert" />
				<Icon icon="offline-mdi-light:link" mode="style" />
			</div>
			<div className="alert">
				<Icon icon={alertIcon} />
				Important notice with alert icon!
			</div>
		</section>
	);
}
