<template>
	<iconify-icon icon="customizer" height="20" :style="{ color: 'blue' }" />
</template>

<script lang="ts">
import { addIcon } from 'iconify-icon';
import adminCustomizer from '@iconify-icons/dashicons/admin-customizer';

addIcon('customizer', adminCustomizer);
</script>
