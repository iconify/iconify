<script>
    import { onDestroy } from 'svelte';
    import { renderContent, subscribeToIconData } from './functions.js';
    import { renderCSS } from './status.js';
    import { getSizeProps } from '../size.js';

    // Props
    let {
        content,
        fallback,
        width,
        height,
        viewBox,
        ...props
    } = $props();

    // Content
    // @type {string}
    let renderedContent = $derived(renderContent(content || ''));

    // Icon to render from API, set to empty string if CSS rendering is used
     // @type {import('@iconify/types').IconifyIcon | string}
    let fallbackToRender = $derived(renderCSS && content ? '' : fallback || '');

    // Subscribe to icon data updates and watch prop changes
    const subscriber = subscribeToIconData(
        // svelte-ignore state_referenced_locally
        fallbackToRender,
        (newData) => {
            iconData = newData;
        }
    );

    // Data for icon to render
    // @type {import('@iconify/types').IconifyIcon | null | undefined}
    let iconData = $state(subscriber.data);

    $effect(() => {
        subscriber.change(fallbackToRender)
    });
    onDestroy(subscriber.unsubscribe);

    // Render fallback icon
    let fallbackIcon = $derived.by(() => {
        const data = iconData;
        return data ? renderContent(data) : '';
    });

    // Icon size
    let size = $derived(getSizeProps(width, height, viewBox));
</script>

<svg xmlns="http://www.w3.org/2000/svg" {...size} {...props}>
    {@html fallbackIcon || renderedContent}
</svg>