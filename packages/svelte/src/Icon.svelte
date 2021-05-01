<script>
	import { onMount, onDestroy } from 'svelte';
	import { checkIconState, generateIcon } from './functions';

	// State
	const state = {
		// Last icon name
		name: '',

		// Loading status
		loading: null,
	};

	// Mounted status
	let mounted = false;

	// Callback counter
	let counter = 0;

	// Generated data
	let data;

	// Generate data
	$: {
		counter;
		data = mounted ? generateIcon(checkIconState($$props.icon, state, loaded), $$props) : null;
	}

	// Increase counter when loaded to force re-calculation of data
	function loaded() {
		counter ++;
	}

	// Force re-render
	onMount(() => {
		mounted = true;
	});

	// Abort loading when component is destroyed
	onDestroy(() => {
		mounted = false;
		if (state.loading) {
			state.loading.abort();
			state.loading = null;
		}
	})
</script>

{#if data === null}
	<slot />
{:else}
<svg {...data.attributes}>
	{@html data.body}
</svg>
{/if}