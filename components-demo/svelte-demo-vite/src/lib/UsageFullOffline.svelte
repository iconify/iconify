<script lang="ts">
	import Icon, { type IconifyIcon } from '@iconify/svelte';

    const accountIcon: IconifyIcon = {
        body: "<path fill=\"currentColor\" d=\"M11.5 14c4.14 0 7.5 1.57 7.5 3.5V20H4v-2.5c0-1.93 3.36-3.5 7.5-3.5m6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S5 16.12 5 17.5V19h13zM11.5 5A3.5 3.5 0 0 1 15 8.5a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8 8.5A3.5 3.5 0 0 1 11.5 5m0 1A2.5 2.5 0 0 0 9 8.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 14 8.5A2.5 2.5 0 0 0 11.5 6\"/>",
        width: 24,
        height: 24
    };
    const alertIcon: IconifyIcon = {
        body: "<path fill=\"currentColor\" d=\"M1 21L11.5 2.81L22 21zm19.27-1L11.5 4.81L2.73 20zM11 14v-4h1v4zm0 2h1v2h-1z\"/>",
        width: 24,
        height: 24
    }
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