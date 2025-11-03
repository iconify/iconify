<script module>
	// Export stuff.
	// Important: duplicate of iconify.ts. When changing exports, they must be changed in both files.
	import { 
		iconLoaded,
		getIcon,
		listIcons,
		addIcon,
		addCollection,
		calculateSize,
		replaceIDs,
		clearIDCache,
		buildIcon,
		loadIcons,
		loadIcon,
		setCustomIconLoader,
		setCustomIconsLoader,
		addAPIProvider,
		_api
	} from './functions';
	
	export { 
		iconLoaded,
		getIcon,
		listIcons,
		addIcon,
		addCollection,
		calculateSize,
		replaceIDs,
		clearIDCache,
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
	import { onDestroy } from 'svelte';
	import { checkIconState, generateIcon } from './functions';

	// State
	const iconState = {
		// Last icon name
		name: '',

		// Loading status
		loading: null,

		// Destroyed status
		destroyed: false,
	};

	// Props
	const props = $props();

	// Callback counter
	let counter = $state(0);

	// Get icon data
	let iconData = $derived.by(() => {
		counter;
		return checkIconState(props.icon, iconState, loaded, props.onload);
	});

	// Generate data to render
	let data = $derived.by(() => {
		const generatedData = iconData ? generateIcon(iconData.data, props) : null;
		if (generatedData && iconData.classes) {
			// Add classes
			generatedData.attributes['class'] = (typeof props['class'] === 'string' ? props['class'] + ' ' : '') + iconData.classes.join(' ');
		}
		return generatedData;
	});

	// Increase counter when loaded to force re-calculation of data
	function loaded() {
		counter ++;
	}

	// Abort loading when component is destroyed
	onDestroy(() => {
		iconState.destroyed = true;
		if (iconState.loading) {
			iconState.loading.abort();
			iconState.loading = null;
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