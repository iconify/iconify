<template>
	<section>
		<h1>Transformations (components/Transform.vue)</h1>
		<div>
			Default icon:
			<Icon icon="demo" />
		</div>
		<div>
			Flip horizontally:
			<Icon icon="demo" :hFlip="true" />
			<Icon icon="demo" flip="horizontal" />
			<Icon icon="demo" :horizontal-flip="true" />
			<Icon icon="demo" :h-flip="true" />
		</div>
		<div>
			Flip vertically:
			<Icon icon="demo" :vFlip="true" />
			<Icon icon="demo" flip="vertical" />
			<Icon icon="demo" :vertical-flip="true" />
			<Icon icon="demo" :v-flip="true" />
		</div>
		<div>
			Flip horizontally and vertically:
			<Icon icon="demo" :hFlip="true" :vFlip="true" />
			<Icon icon="demo" flip="horizontal,vertical" />
			<Icon icon="demo" :horizontal-flip="true" :vertical-flip="true" />
			<Icon icon="demo" :h-flip="true" :v-flip="true" />
		</div>
		<div>
			90&deg; rotation:
			<Icon icon="demo" :rotate="1" />
			<Icon icon="demo" rotate="90deg" />
			<Icon icon="demo" rotate="25%" />
		</div>
		<div>
			180&deg; rotation:
			<Icon icon="demo" :rotate="2" />
			<Icon icon="demo" rotate="180deg" />
			<Icon icon="demo" rotate="50%" />
		</div>
		<div>
			270&deg; rotation:
			<Icon icon="demo" :rotate="3" />
			<Icon icon="demo" rotate="270deg" />
			<Icon icon="demo" rotate="-25%" />
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
