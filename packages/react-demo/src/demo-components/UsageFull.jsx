import React from 'react';
import { Icon } from '@iconify/react/dist/iconify';

export function FullUsageDemo() {
	return (
		<section className="icon-24">
			<h1>Usage (full module)</h1>
			<div>
				Icon referenced by name: <Icon icon="mdi:home" />
			</div>
			<div className="alert">
				<Icon icon="mdi-light:alert" />
				Important notice with alert icon!
			</div>
		</section>
	);
}
