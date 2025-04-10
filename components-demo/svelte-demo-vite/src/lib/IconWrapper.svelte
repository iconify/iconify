<script lang="ts">
	import Icon, { iconLoaded, loadIcons, type IconifyIconLoaderAbort } from '@iconify/svelte';
	import { onDestroy } from 'svelte';

	// Icon to render and fallback children
	let { icon, fallback } = $props();

	// Icon status and cleanup function
	let loaded = $state(false);
    let cleanup: IconifyIconLoaderAbort | null = null;
    let update = $state(0);

    $effect(() => {
        // Mention update to re-run this effect when state changes
        update;

        // Get icon data
        loaded = iconLoaded(icon);

        // Cancel previous callback
        if (cleanup) {
            cleanup();
            cleanup = null;
        }

        // Load icon
        if (!loaded) {
            cleanup = loadIcons([icon], () => {
                // Trigger re-running of code above
                update ++;
            });
        }
    })


    // Cleanup
    onDestroy(() => {
        if (cleanup) {
            cleanup();
        }
    })
</script>

{#if loaded}
	<Icon icon={icon} />
{:else}
    {@render fallback?.()}
{/if}
