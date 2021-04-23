import React from 'react';
import { Icon } from '@iconify/react';

export function InlineDemo() {
	return (
		<section className="inline-demo">
			<h1>Inline (components/Inline.jsx)</h1>
			<div>
				Block icon (behaving like image):
				<Icon icon="experiment2" />
			</div>
			<div>
				Inline icon (behaving line text / icon font):
				<Icon icon="experiment2" inline={true} />
			</div>
			<div>
				Using "vertical-align: 0" to override inline attribute:
				<Icon icon="experiment2" style={{ verticalAlign: 0 }} />
				<Icon
					icon="experiment2"
					style={{ verticalAlign: 0 }}
					inline={true}
				/>
			</div>
		</section>
	);
}
