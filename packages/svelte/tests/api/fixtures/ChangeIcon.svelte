<script>
    import Icon from '../../../dist/';

    export let icon1;
    export let icon2;
    export let expose;
    export let onLoad;

    let icon = icon1;

    $: {
        expose(swap);
    }

    function swap() {
        icon = icon2;
    }
</script>
<Icon icon={icon} onLoad={onLoad} />