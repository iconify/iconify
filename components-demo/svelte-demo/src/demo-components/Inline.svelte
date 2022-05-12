<script>
    import OfflineIcon from '@iconify/svelte/dist/OfflineIcon.svelte';
    import FullIcon from '@iconify/svelte';
</script>

<section class="inline-demo">
    <h1>Inline demo</h1>
    <div>
        Block icon (behaving like image):
        <OfflineIcon icon="experiment2" />
        <OfflineIcon icon="experiment2" mode="style" />
        <FullIcon icon="experiment2" />
        <FullIcon icon="experiment2" mode="style" />
    </div>
    <div>
        Inline icon (behaving line text / icon font):
        <OfflineIcon icon="experiment2" inline={true} />
        <OfflineIcon icon="experiment2" inline={true} mode="style" />
        <FullIcon icon="experiment2" inline={true} />
        <FullIcon icon="experiment2" inline={true} mode="style" />
    </div>
</section>