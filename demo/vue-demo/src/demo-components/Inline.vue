<template>
	<section class="inline-demo">
		<h1>Inline demo</h1>
		<div>
			Block icon (behaving like image):
			<OfflineIcon id="inline-demo-block-offline" icon="experiment2" />
			<FullIcon id="inline-demo-block-full" icon="experiment2" />
		</div>
		<div>
			Inline icon (behaving line text / icon font):
			<OfflineIcon
				id="inline-demo-inline-offline"
				icon="experiment2"
				:inline="true"
			/>
			<FullIcon
				id="inline-demo-inline-full"
				icon="experiment2"
				:inline="true"
			/>
		</div>
	</section>
</template>

<script lang="ts">
import { Icon as OfflineIcon } from '@iconify/vue/dist/offline';
import { Icon as FullIcon } from '@iconify/vue';

export default {
	components: {
		OfflineIcon,
		FullIcon,
	},
};
</script>
