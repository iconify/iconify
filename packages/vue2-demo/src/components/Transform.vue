<template>
	<section>
		<h1>Transformations (components/Transform.vue)</h1>
		<div>
			Default icon:
			<iconify-icon icon="experiment" />
		</div>
		<div>
			Flip horizontally:
			<iconify-icon icon="experiment" :hFlip="true" />
			<iconify-icon icon="experiment" flip="horizontal" />
			<iconify-icon icon="experiment" :horizontal-flip="true" />
			<iconify-icon icon="experiment" :h-flip="true" />
		</div>
		<div>
			Flip vertically:
			<iconify-icon icon="experiment" :vFlip="true" />
			<iconify-icon icon="experiment" flip="vertical" />
			<iconify-icon icon="experiment" :vertical-flip="true" />
			<iconify-icon icon="experiment" :v-flip="true" />
		</div>
		<div>
			Flip horizontally and vertically:
			<iconify-icon icon="experiment" :hFlip="true" :vFlip="true" />
			<iconify-icon icon="experiment" flip="horizontal,vertical" />
			<iconify-icon
				icon="experiment"
				:horizontal-flip="true"
				:vertical-flip="true"
			/>
			<iconify-icon icon="experiment" :h-flip="true" :v-flip="true" />
		</div>
		<div>
			90&deg; rotation:
			<iconify-icon icon="experiment" :rotate="1" />
			<iconify-icon icon="experiment" rotate="90deg" />
			<iconify-icon icon="experiment" rotate="25%" />
		</div>
		<div>
			180&deg; rotation:
			<iconify-icon icon="experiment" :rotate="2" />
			<iconify-icon icon="experiment" rotate="180deg" />
			<iconify-icon icon="experiment" rotate="50%" />
		</div>
		<div>
			270&deg; rotation:
			<iconify-icon icon="experiment" :rotate="3" />
			<iconify-icon icon="experiment" rotate="270deg" />
			<iconify-icon icon="experiment" rotate="-25%" />
		</div>
	</section>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import IconifyIcon from '@iconify/vue';

export default Vue.extend({
	components: {
		IconifyIcon,
	},
});
</script>

<style scoped>
svg {
	font-size: 20px;
	line-height: 1em;
}
</style>
