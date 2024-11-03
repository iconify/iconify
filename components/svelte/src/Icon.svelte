<script context="module">

// Export stuff.
// Important: duplicate of iconify.ts. When changing exports, they must be changed in both files.
import { 
	enableCache,
	disableCache, 
	iconLoaded,
	iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
	calculateSize,
	replaceIDs,
	buildIcon,
	loadIcons,
	loadIcon,
	setCustomIconLoader,
	setCustomIconsLoader,
	addAPIProvider,
	_api
} from './functions';

export { 
	enableCache,
	disableCache, 
	iconLoaded,
	iconExists, // deprecated, kept to avoid breaking changes
	getIcon,
	listIcons,
	addIcon,
	addCollection,
	calculateSize,
	replaceIDs,
	buildIcon,
	loadIcons,
	loadIcon,
	setCustomIconLoader,
	setCustomIconsLoader,
	addAPIProvider,
	_api
}

</script>
<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
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

	const onLoad = (icon) => {
		// Legacy onLoad property
		if (typeof $$props.onLoad === 'function') {
			$$props.onLoad(icon);
		}
		// on:load event
		const dispatch = createEventDispatcher();
		dispatch('load', {
			icon
		});
	}

	// Generate data
	$: {
		counter;
		const isMounted = !!$$props.ssr || mounted;
		const iconData = checkIconState($$props.icon, state, isMounted, loaded, onLoad);
		data = iconData ? generateIcon(iconData.data, $$props) : null;
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

{#if data}
	{#if data.svg}
		<svg {...data.attributes}>
			{@html data.body}
		</svg>
	{:else}
		<span {...data.attributes}></span>
	{/if}
{/if}
