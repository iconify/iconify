<template>
	<section>
		<h1>Transformations (components/Transform.vue)</h1>
		<div>
			Default icon:
			<Icon icon="experiment" />
		</div>
		<div>
			Flip horizontally:
			<Icon icon="experiment" :hFlip="true" />
			<Icon icon="experiment" flip="horizontal" />
			<Icon icon="experiment" :horizontal-flip="true" />
			<Icon icon="experiment" :h-flip="true" />
		</div>
		<div>
			Flip vertically:
			<Icon icon="experiment" :vFlip="true" />
			<Icon icon="experiment" flip="vertical" />
			<Icon icon="experiment" :vertical-flip="true" />
			<Icon icon="experiment" :v-flip="true" />
		</div>
		<div>
			Flip horizontally and vertically:
			<Icon icon="experiment" :hFlip="true" :vFlip="true" />
			<Icon icon="experiment" flip="horizontal,vertical" />
			<Icon
				icon="experiment"
				:horizontal-flip="true"
				:vertical-flip="true"
			/>
			<Icon icon="experiment" :h-flip="true" :v-flip="true" />
		</div>
		<div>
			90&deg; rotation:
			<Icon icon="experiment" :rotate="1" />
			<Icon icon="experiment" rotate="90deg" />
			<Icon icon="experiment" rotate="25%" />
		</div>
		<div>
			180&deg; rotation:
			<Icon icon="experiment" :rotate="2" />
			<Icon icon="experiment" rotate="180deg" />
			<Icon icon="experiment" rotate="50%" />
		</div>
		<div>
			270&deg; rotation:
			<Icon icon="experiment" :rotate="3" />
			<Icon icon="experiment" rotate="270deg" />
			<Icon icon="experiment" rotate="-25%" />
		</div>
	</section>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue/dist/offline';

export default {
	components: {
		Icon,
	},
};
</script>

<style scoped>
svg {
	font-size: 20px;
	line-height: 1em;
}
</style>
