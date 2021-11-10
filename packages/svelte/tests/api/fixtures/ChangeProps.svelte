<script>
    import Icon from '../../../';

    export let icon;
    export let expose;
    export let onLoad;

    const props = {
        icon
    };

    $: {
        expose(swap);
    }

    function swap() {
        props.hFlip = true;
        props.style = {
            color: 'red'
        }
    }
</script>
<Icon {...props} on:load={event => {
    onLoad?.(event.detail.icon)
}} />