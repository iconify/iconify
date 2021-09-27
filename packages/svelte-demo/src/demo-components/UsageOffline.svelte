<script>
	import Icon from '@iconify/svelte/dist/OfflineIcon.svelte';
    import accountIcon from '@iconify-icons/mdi-light/account';
    import alertIcon from '@iconify-icons/mdi-light/alert';
</script>

<section class="icon-24">
    <h1>Usage (offline module)</h1>
    <div>
        Icon referenced by name: <Icon icon="demo" />
    </div>
    <div>
        Icon referenced by object: <Icon icon={accountIcon} />
    </div>
    <div>
        2 icons imported from icon set: 
        <Icon icon="offline-mdi-light:account-alert" />
        <Icon icon="offline-mdi-light:link" />
    </div>
    <div class="alert">
        <Icon icon={alertIcon} />
        Important notice with alert icon!
    </div>
</section>