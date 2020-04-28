<template>
	<iconify-icon :icon="icons.chart" height="20" :style="{ color: 'green' }" />
</template>

<script>
import IconifyIcon from '@iconify/vue';
import adminCustomizer from '@iconify/icons-dashicons/admin-customizer';

export default {
	components: {
		IconifyIcon,
	},
	data() {
		return {
			icons: {
				chart: adminCustomizer,
			},
		};
	},
};
</script>
