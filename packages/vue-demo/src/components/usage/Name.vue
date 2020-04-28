<template>
	<iconify-icon icon="customizer" height="20" :style="{ color: 'purple' }" />
</template>

<script>
import IconifyIcon from '@iconify/vue';
import adminCustomizer from '@iconify/icons-dashicons/admin-customizer';

IconifyIcon.addIcon('customizer', adminCustomizer);

export default {
	components: {
		IconifyIcon,
	},
};
</script>
