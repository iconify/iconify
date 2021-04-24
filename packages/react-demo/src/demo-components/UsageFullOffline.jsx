import React from 'react';
import { Icon } from '@iconify/react/dist/iconify';
import accountIcon from '@iconify-icons/mdi-light/account';
import alertIcon from '@iconify-icons/mdi-light/alert';

export function FullOfflineUsageDemo() {
	return (
		<section className="icon-24">
			<h1>Usage (full module, offline mode)</h1>
			<div>
				Icon referenced by name: <Icon icon="demo" />
			</div>
			<div>
				Icon referenced by object: <Icon icon={accountIcon} />
			</div>
			<div>
				2 icons imported from icon set: <Icon icon="alert1" />
				<Icon icon="link1" />
			</div>
			<div className="alert">
				<Icon icon={alertIcon} />
				Important notice with alert icon!
			</div>
		</section>
	);
}
