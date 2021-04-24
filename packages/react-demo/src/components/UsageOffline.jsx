import React from 'react';
import { Icon } from '@iconify/react/dist/offline';
import accountIcon from '@iconify-icons/mdi-light/account';
import alertIcon from '@iconify-icons/mdi-light/alert';

export function OfflineUsageDemo() {
	return (
		<section className="icon-24">
			<h1>Usage (offline module)</h1>
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
	);
}
