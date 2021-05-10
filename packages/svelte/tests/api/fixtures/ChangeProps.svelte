<script>
    import { Icon } from '../../../dist/iconify';

    export let icon;
    export let expose;
    export let onLoad;

    const props = {
        icon,
        onLoad
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
<Icon {...props} />