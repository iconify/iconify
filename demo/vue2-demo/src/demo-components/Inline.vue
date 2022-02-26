<template>
	<section class="inline-demo">
		<h1>Inline demo</h1>
		<div>
			Block icon (behaving like image):
			<OfflineIcon icon="experiment2" />
			<FullIcon icon="experiment2" id="inline-demo-block-full" />
		</div>
		<div>
			Inline icon (behaving line text / icon font):
			<OfflineIcon icon="experiment2" :inline="true" />
			<FullIcon
				icon="experiment2"
				:inline="true"
				id="inline-demo-inline-full"
			/>
		</div>
	</section>
</template>

<script>
import { Icon as OfflineIcon } from '@iconify/vue2/dist/offline';
import { Icon as FullIcon } from '@iconify/vue2';

export default {
	components: {
		OfflineIcon,
		FullIcon,
	},
};
</script>
