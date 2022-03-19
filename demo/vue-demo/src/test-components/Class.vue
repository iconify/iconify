<template>
	<section>
		<h1>Class (components/Class.vue)</h1>
		<div>
			Default icon:
			<Icon icon="demo" />
		</div>
		<div>
			Red color:
			<Icon icon="demo" class="red-color" />
			<Icon icon="demo" :class="redClass" />
		</div>
		<div>
			Red color and 20px:
			<Icon icon="demo" class="red-color big-icon" />
			<Icon icon="demo" :class="[redClass, bigIcon]" />
		</div>
	</section>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue/dist/offline';

export default {
	components: {
		Icon,
	},
	data: () => {
		return {
			redClass: 'red-color',
			bigIcon: 'big-icon',
		};
	},
};
</script>

<style>
.red-color {
	color: red;
}
.big-icon {
	font-size: 20px;
}
</style>
