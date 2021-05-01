<script>
    import { Icon } from '../../../dist/iconify';

    export let icon1;
    export let icon2;
    export let expose;

    let icon = icon1;

    $: {
        expose(swap);
    }

    function swap() {
        icon = icon2;
    }
</script>
<Icon icon={icon} />