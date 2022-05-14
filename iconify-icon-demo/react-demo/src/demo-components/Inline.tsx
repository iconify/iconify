import React from 'react';
import { Icon } from '@iconify-icon/react';

export function InlineDemo() {
	return (
		<section className="inline-demo">
			<h1>Inline demo</h1>
			<div>
				Block icon (behaving like image):
				<Icon icon="experiment2" />
				<Icon
					icon="experiment2"
					inline={true}
					style={{ verticalAlign: '0' }}
				/>
			</div>
			<div>
				Inline icon (behaving line text / icon font):
				<Icon icon="experiment2" inline={true} />
				<Icon
					icon="experiment2"
					style={{ verticalAlign: '-0.125em' }}
				/>
			</div>
		</section>
	);
}
