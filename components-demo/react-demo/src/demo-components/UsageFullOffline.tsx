import React from 'react';
import { Icon } from '@iconify/react';
import accountIcon from '@iconify-icons/mdi-light/account';
import alertIcon from '@iconify-icons/mdi-light/alert';

export function FullOfflineUsageDemo() {
	return (
		<section className="icon-24">
			<h1>Usage (full module, offline mode)</h1>
			<div>
				Icons referenced by name (as SVG, as SPAN): <Icon icon="demo" />
				<Icon icon="demo" mode="style" />
			</div>
			<div>
				Icons referenced by object (as SVG, as SPAN):{' '}
				<Icon icon={accountIcon} />
				<Icon icon={accountIcon} mode="style" />
			</div>
			<div>
				2 icons imported from icon set: <Icon icon="alert1" />
				<Icon icon="link1" mode="style" />
			</div>
			<div className="alert">
				<Icon icon={alertIcon} mode="mask" />
				Important notice with alert icon!
			</div>
			<div>
				Icon without size, scaled to 48px with CSS:
				<Icon icon="demo" height="unset" style={{ height: '48px' }} />
			</div>
		</section>
	);
}
