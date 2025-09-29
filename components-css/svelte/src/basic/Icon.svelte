<script>
    import { getSizeProps, renderContent } from './functions.js';

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

    // Icon size
    const size = $derived(getSizeProps(width, height, viewBox));

</script>

<svg xmlns="http://www.w3.org/2000/svg" {...size} {...props}>
    {@html renderedContent}
</svg>