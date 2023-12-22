<script>
	import Icon from '@iconify/svelte';
    import accountIcon from '@iconify-icons/mdi-light/account';
    import alertIcon from '@iconify-icons/mdi-light/alert';
</script>

<section class="icon-24">
    <h1>Usage  (full module, offline mode)</h1>
    <div>
        Icon referenced by name: <Icon icon="demo" />
    </div>
    <div>
        Icon referenced by object: <Icon icon={accountIcon} />
    </div>
    <div>
        2 icons imported from icon set: <Icon icon="alert1" /><Icon icon="link1" />
    </div>
    <div class="alert">
        <Icon icon={alertIcon} />
        Important notice with alert icon!
    </div>
    <div>
        Icon without size, scaled to 48px with CSS:
        <Icon icon="demo" height="unset" style="height: 48px" />
    </div>
</section>