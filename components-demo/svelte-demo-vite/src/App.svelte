<script lang="ts">
	import { addIcon as addOfflineIcon, addCollection as addOfflineCollection } from '@iconify/svelte/dist/OfflineIcon.svelte';
	import {
		addIcon as addOnlineIcon,
		addCollection as addOnlineCollection,
		disableCache,
	} from '@iconify/svelte';

	import Checkbox from './lib/Checkbox.svelte';
	import InlineDemo from './lib/Inline.svelte';
	import OfflineUsageDemo from './lib/UsageOffline.svelte';
	import FullOfflineUsageDemo from './lib/UsageFullOffline.svelte';
	import FullUsageDemo from './lib/UsageFull.svelte';

	// Disable cache
	disableCache('all');

	// Add 'mdi-light:presentation-play' as 'demo' for offline module
	addOfflineIcon('demo', {
		body: "<path fill=\"currentColor\" d=\"M2 4h8a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1h8v1h-1v11h-5.73l1.61 6h-1.04l-1.61-6H9.77l-1.61 6H7.12l1.61-6H3V5H2zm17 11V5H4v10zm-9-8h1l3 3l-3 3h-1zm1 1.41v3.18L12.59 10z\"/>",
		width: 24,
		height: 24
	});

	// Add 'mdi-light:play' as 'demo' for full module
	addOnlineIcon('demo', {
		body: "<path fill=\"currentColor\" d=\"M18.4 12.5L9 18.38L8 19V6zm-1.9 0L9 7.8v9.4z\"/>",
		width: 24,
		height: 24
	});

	// Add custom icon as 'experiment'
	addOfflineIcon('experiment2', {
		width: 16,
		height: 16,
		body: '<g fill="none" stroke-linecap="round" stroke-width="1" stroke="currentColor"><circle cx="8" cy="8" r="7.5" stroke-dasharray="48" stroke-dashoffset="48"><animate id="circle" attributeName="stroke-dashoffset" values="48;0" dur="0.5s" fill="freeze" /></circle><path d="M8 5v3" stroke-width="2" stroke-dasharray="5" stroke-dashoffset="5"><animate attributeName="stroke-dashoffset" values="5;0" dur="0.3s" begin="circle.end+0.1s" fill="freeze" /></path></g><circle cx="8" cy="11" r="1" fill="currentColor" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.2s" begin="circle.end+0.5s" fill="freeze" /></circle>',
	});
	addOnlineIcon('experiment2', {
		width: 16,
		height: 16,
		body: '<mask id="coffee-mask" x="0" y="0" width="16" height="16"><g fill="white"><path d="M5-2c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M8.5-2c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M12-2c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4" stroke="white" stroke-width="1" fill="none"><animateMotion path="M0 0v-8" calcMode="linear" dur="3s" repeatCount="indefinite" /></path></g><rect y="4" width="16" height="12" fill="black" /><path d="M2 5H13C14.1046 5 15 5.89543 15 7V8C15 9.10457 14.1046 10 13 10H12V14C12 15.1046 11.1046 16 10 16H4C2.89543 16 2 15.1046 2 14V5Z" fill="white" /><path d="M12 6H13C13.5523 6 14 6.44772 14 7V8C14 8.55228 13.5523 9 13 9H12V6Z" fill="black" /></mask><rect mask="url(#coffee-mask)" width="16" height="16" fill="currentColor" />',
	});

	// Add few mdi-light: icons
	addOfflineCollection({
		prefix: 'offline-mdi-light',
		icons: {
			'account-alert': {
				body:
					'<path d="M10.5 14c4.142 0 7.5 1.567 7.5 3.5V20H3v-2.5c0-1.933 3.358-3.5 7.5-3.5zm6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S4 16.12 4 17.5V19h13v-1.5zM10.5 5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM20 16v-1h1v1h-1zm0-3V7h1v6h-1z" fill="currentColor"/>',
			},
			'link': {
				body:
					'<path d="M8 13v-1h7v1H8zm7.5-6a5.5 5.5 0 1 1 0 11H13v-1h2.5a4.5 4.5 0 1 0 0-9H13V7h2.5zm-8 11a5.5 5.5 0 1 1 0-11H10v1H7.5a4.5 4.5 0 1 0 0 9H10v1H7.5z" fill="currentColor"/>',
			},
		},
		width: 24,
		height: 24,
	});
	addOnlineCollection({
		prefix: '',
		icons: {
			alert1: {
				body:
					'<path d="M10.5 14c4.142 0 7.5 1.567 7.5 3.5V20H3v-2.5c0-1.933 3.358-3.5 7.5-3.5zm6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S4 16.12 4 17.5V19h13v-1.5zM10.5 5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM20 16v-1h1v1h-1zm0-3V7h1v6h-1z" fill="currentColor"/>',
			},
			link1: {
				body:
					'<path d="M8 13v-1h7v1H8zm7.5-6a5.5 5.5 0 1 1 0 11H13v-1h2.5a4.5 4.5 0 1 0 0-9H13V7h2.5zm-8 11a5.5 5.5 0 1 1 0-11H10v1H7.5a4.5 4.5 0 1 0 0 9H10v1H7.5z" fill="currentColor"/>',
			},
		},
		width: 24,
		height: 24,
	});

</script>

<main>
	<OfflineUsageDemo />
	<FullOfflineUsageDemo />
	<FullUsageDemo />

	<section>
		<h1>Checkbox</h1>
		<div>
			<Checkbox
				checked={true}
				text="Checkbox example"
				hint="(click to toggle)"
			/>
			<Checkbox
				checked={false}
				text="Another checkbox example"
				hint="(click to toggle)"
			/>
		</div>
	</section>

	<InlineDemo />
</main>
