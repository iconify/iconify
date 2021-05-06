<template>
	<iconify-icon icon="customizer" height="20" :style="{ color: 'blue' }" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IconifyIcon from '@iconify/vue';
import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';

IconifyIcon.addIcon('customizer', adminCustomizer);

export default Vue.extend({
	components: {
		IconifyIcon,
	},
});
</script>
