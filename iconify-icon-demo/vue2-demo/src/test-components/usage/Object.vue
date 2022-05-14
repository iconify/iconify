<template>
	<iconify-icon :icon="icons.chart" height="20" :style="{ color: 'green' }" />
</template>

<script>
import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';

export default {
	data() {
		return {
			icons: {
				chart: JSON.stringify(adminCustomizer),
			},
		};
	},
};
</script>
