<template>
	<div id="app">
		<OfflineUsageDemo />
		<UsageDemo />

		<section>
			<h1>Checkbox</h1>
			<div>
				<Checkbox
					:checked="true"
					text="Checkbox example"
					hint="(click icon to toggle)"
				/>
				<Checkbox
					:checked="false"
					text="Another checkbox example"
					hint="(only clicking icon works to test @click events)"
				/>
			</div>
		</section>

		<InlineDemo />

		<StyleTest />
		<InlineTest />
		<VueAttributesTest />
	</div>
</template>

<script lang="ts">
import { addIcon, addCollection, disableCache } from 'iconify-icon';
import bxBarChartAlt from '@iconify-icons/bx/bx-bar-chart-alt';

import Checkbox from './demo-components/Checkbox.vue';
import InlineDemo from './demo-components/Inline.vue';
import OfflineUsageDemo from './demo-components/UsageOffline.vue';
import UsageDemo from './demo-components/Usage.vue';

import StyleTest from './test-components/Style.vue';
import InlineTest from './test-components/Inline.vue';
import VueAttributesTest from './test-components/VueAttributes.vue';

// Disable cache
disableCache('all');

// Add custom icons
addIcon('demo', bxBarChartAlt);
addIcon('experiment2', {
	width: 16,
	height: 16,
	body: '<g fill="none" stroke-linecap="round" stroke-width="1" stroke="currentColor"><circle cx="8" cy="8" r="7.5" stroke-dasharray="48" stroke-dashoffset="48"><animate id="circle" attributeName="stroke-dashoffset" values="48;0" dur="0.5s" fill="freeze" /></circle><path d="M8 5v3" stroke-width="2" stroke-dasharray="5" stroke-dashoffset="5"><animate attributeName="stroke-dashoffset" values="5;0" dur="0.3s" begin="circle.end+0.1s" fill="freeze" /></path></g><circle cx="8" cy="11" r="1" fill="currentColor" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.2s" begin="circle.end+0.5s" fill="freeze" /></circle>',
});

// Add few mdi-light: icons
addCollection({
	prefix: '',
	icons: {
		alert1: {
			body: '<path d="M10.5 14c4.142 0 7.5 1.567 7.5 3.5V20H3v-2.5c0-1.933 3.358-3.5 7.5-3.5zm6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S4 16.12 4 17.5V19h13v-1.5zM10.5 5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM20 16v-1h1v1h-1zm0-3V7h1v6h-1z" fill="currentColor"/>',
		},
		link1: {
			body: '<path d="M8 13v-1h7v1H8zm7.5-6a5.5 5.5 0 1 1 0 11H13v-1h2.5a4.5 4.5 0 1 0 0-9H13V7h2.5zm-8 11a5.5 5.5 0 1 1 0-11H10v1H7.5a4.5 4.5 0 1 0 0 9H10v1H7.5z" fill="currentColor"/>',
		},
	},
	width: 24,
	height: 24,
});

export default {
	name: 'App',
	components: {
		Checkbox,
		InlineDemo,
		OfflineUsageDemo,
		UsageDemo,
		StyleTest,
		InlineTest,
		VueAttributesTest,
	},
};
</script>
