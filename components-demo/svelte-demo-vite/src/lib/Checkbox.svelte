<script>
    import Icon, {addIcon } from '@iconify/svelte/dist/OfflineIcon.svelte';

    addIcon('demo:checked', {
        body: "<path fill=\"currentColor\" d=\"M10.21 14.75a1 1 0 0 0 1.42 0l4.08-4.08a1 1 0 0 0-1.42-1.42l-3.37 3.38l-1.21-1.22a1 1 0 0 0-1.42 1.42ZM21 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1m-1 18H4V4h16Z\"/>",
        width: 24,
        height: 24
    })
    addIcon('demo:unchecked', {
        body: "<path fill=\"currentColor\" d=\"M21 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1m-1 18H4V4h16Z\"/>",
        width: 24,
        height: 24
    })

    export let checked = false;
    export let text = '';
    export let hint = '';

    let isChecked = checked;

    let icon = '';
    let className = '';
    $: {
		icon = isChecked ? 'demo:checked' : 'demo:unchecked';
		className =
			'checkbox checkbox--' + (isChecked ? 'checked' : 'unchecked');
    }

    function toggle() {
        isChecked = !isChecked;
    }
</script>

<div class="checkbox-container">
    <a href="# " class={className} on:click|preventDefault={toggle}><Icon icon={icon} mode={checked ? 'svg' : 'style'} />{text}</a>
    <small>{hint}</small>
</div>
