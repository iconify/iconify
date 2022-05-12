<template>
	<Icon :icon="icons.chart" height="20" :style="{ color: 'red' }" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Icon } from '@iconify/vue2';
import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';

export default Vue.extend({
	components: {
		Icon,
	},
	data() {
		return {
			icons: {
				chart: adminCustomizer,
			},
		};
	},
});
</script>
