<script module>

	// Export stuff.
	// Important: duplicate of offline-iconify.ts. When changing exports, they must be changed in both files.
	import {
		addIcon,
		addCollection
	} from './offline-functions';
	
	export {
		addIcon,
		addCollection
	}
		
</script>
<script>
	import { generateIcon } from './offline-functions';

	// Props
	let props = $props();

	// Generated data
	const data = $derived(generateIcon(props))
</script>

{#if data}
	{#if data.svg}
		<svg {...data.attributes}>
			{@html data.body}
		</svg>
	{:else}
		<span {...data.attributes}></span>
	{/if}
{/if}