<script>
    import Icon from '@iconify/svelte/offline';
    import checkedIcon from '@iconify-icons/uil/check-square';
    import uncheckedIcon from '@iconify-icons/uil/square';

    export let checked;
    export let text;
    export let hint;

    let isChecked = checked;

    let icon;
    let className;
    $: {
		icon = isChecked ? checkedIcon : uncheckedIcon;
		className =
			'checkbox checkbox--' + (isChecked ? 'checked' : 'unchecked');
    }

    function toggle() {
        isChecked = !isChecked;
    }
</script>

<div class="checkbox-container">
    <a href="# " class={className} on:click|preventDefault={toggle}><Icon icon={icon} />{text}</a>
    <small>{hint}</small>
</div>