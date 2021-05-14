<script context="module">

// Export stuff.
// Important: duplicate of iconify.ts. When changing exports, they must be changed in both files.
import { 
	enableCache,
	disableCache, 
	iconExists,
	getIcon,
	listIcons,
	addIcon,
	addCollection,
	calculateSize,
	replaceIDs,
	buildIcon,
	loadIcons,
	addAPIProvider,
	_api
} from './functions';

export { 
	enableCache,
	disableCache, 
	iconExists,
	getIcon,
	listIcons,
	addIcon,
	addCollection,
	calculateSize,
	replaceIDs,
	buildIcon,
	loadIcons,
	addAPIProvider,
	_api
}

</script>
<script>
	import { onMount, onDestroy } from 'svelte';
	import { checkIconState, generateIcon } from './functions';

	// State
	const state = {
		// Last icon name
		name: '',

		// Loading status
		loading: null,

		// Destroyed status
		destroyed: false,
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
		const iconData = checkIconState($$props.icon, state, loaded, $$props.onLoad);
		data = mounted && iconData ? generateIcon(iconData.data, $$props) : null;
		if (data && iconData.classes) {
			// Add classes
			data.attributes['class'] = (typeof $$props['class'] === 'string' ? $$props['class'] + ' ' : '') + iconData.classes.join(' ');
		}
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
		state.destroyed = true;
		if (state.loading) {
			state.loading.abort();
			state.loading = null;
		}
	})
</script>

{#if data !== null}
<svg {...data.attributes}>
	{@html data.body}
</svg>
{/if}