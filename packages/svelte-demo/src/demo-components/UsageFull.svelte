<script>
	import Icon from '@iconify/svelte';

    let onLoadCalled = false;
</script>

<section class="icon-24">
    <h1>Usage  (full module)</h1>
    <div>
        Icon referenced by name: <Icon icon="mdi:home" />
    </div>
    <div class="alert">
        <Icon icon="mdi-light:alert" on:load={event => {
            console.log(event);
            onLoadCalled = true;
        }} />
        Important notice with alert icon{onLoadCalled ? '' : ' (loading...)'}!
    </div>
</section>