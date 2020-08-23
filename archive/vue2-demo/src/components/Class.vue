<template>
	<section>
		<h1>Class (components/Class.vue)</h1>
		<div>
			Default icon:
			<iconify-icon icon="experiment" />
		</div>
		<div>
			Red color:
			<iconify-icon icon="experiment" class="red-color" />
			<iconify-icon icon="experiment" :class="redClass" />
		</div>
		<div>
			Red color and 20px:
			<iconify-icon icon="experiment" class="red-color big-icon" />
			<iconify-icon icon="experiment" :class="[redClass, bigIcon]" />
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
	data: () => {
		return {
			redClass: 'red-color',
			bigIcon: 'big-icon',
		};
	},
});
</script>

<style>
.red-color {
	color: red;
}
.big-icon {
	font-size: 20px;
}
</style>
