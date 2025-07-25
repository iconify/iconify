<script>
	import Icon from '@iconify/svelte';
    import IconWrapper from './IconWrapper.svelte';

    let onLoadCalled = $state(false);
</script>

<section class="icon-24">
    <h1>Usage  (full module)</h1>
    <div>
        Icon referenced by name (as svg, as span): <Icon icon="mdi:home" mode="svg" /><Icon icon="mdi:home" mode="style" />
    </div>
    <div class="alert">
        <Icon icon="mdi-light:alert" onload={event => {
            console.log('onLoad event value:', event);
            onLoadCalled = true;
        }} mode="style" />
        Important notice with alert icon{onLoadCalled ? '' : ' (loading...)'}!
    </div>
    <div>Icons with fallback (valid, missing): 
        <IconWrapper icon="mdi-light:alert">
            {#snippet fallback()}
                <small>(loading...)</small>
	        {/snippet}
        </IconWrapper>
        <IconWrapper icon="mdi-light:no-such-icon">
            {#snippet fallback()}
                <small>(missing)</small>
	        {/snippet}
        </IconWrapper>
    </div>
</section>