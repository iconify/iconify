<script>
	import { generateIcon } from './offline';

	// Generated data
	let data;

	$: {
		data = generateIcon($$props);
	}
</script>

{#if data === null}
	<slot />
{:else}
<svg {...data.attributes}>
	{@html data.body}
</svg>
{/if}