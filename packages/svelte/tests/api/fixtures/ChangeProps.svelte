<script>
    import { Icon } from '../../../dist/iconify';

    export let icon;
    export let expose;

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
<Icon {...props} />