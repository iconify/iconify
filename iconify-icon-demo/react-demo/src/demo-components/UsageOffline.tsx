import React from 'react';
import { Icon } from '@iconify-icon/react';
import accountIcon from '@iconify-icons/mdi-light/account';
import alertIcon from '@iconify-icons/mdi-light/alert';

export function OfflineUsageDemo() {
	return (
		<section className="icon-24">
			<h1>Usage (offline mode: using preloaded icons)</h1>
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
				2 icons imported from icon set: <Icon icon="test:alert1" />
				<Icon icon="test:link1" mode="style" />
			</div>
			<div className="alert">
				<Icon icon={alertIcon} mode="mask" />
				Important notice with alert icon!
			</div>
		</section>
	);
}
