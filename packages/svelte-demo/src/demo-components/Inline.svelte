<script>
    import { Icon as OfflineIcon } from '@iconify/svelte/dist/offline';
    import { Icon as FullIcon } from '@iconify/svelte';
</script>

<section class="inline-demo">
    <h1>Inline demo</h1>
    <div>
        Block icon (behaving like image):
        <OfflineIcon icon="experiment2" />
        <FullIcon icon="experiment2" />
    </div>
    <div>
        Inline icon (behaving line text / icon font):
        <OfflineIcon icon="experiment2" inline={true} />
        <FullIcon icon="experiment2" inline={true} />
    </div>
</section>