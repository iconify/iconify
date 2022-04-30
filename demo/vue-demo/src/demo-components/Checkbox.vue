<template>
	<div class="checkbox-container">
		<span :class="className">
			<Icon
				:icon="icon"
				:mode="isChecked ? 'svg' : 'style'"
				@click="check"
			/>{{ text }}
		</span>
		<small>{{ hint }}</small>
	</div>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue/dist/offline';
import checkedIcon from '@iconify-icons/bx/bx-checkbox-checked';
import uncheckedIcon from '@iconify-icons/bx/bx-checkbox';

export default {
	components: {
		Icon,
	},
	props: {
		text: String,
		hint: String,
		checked: Boolean,
	},
	methods: {
		check(event: MouseEvent) {
			event.preventDefault();
			this.state = !this.isChecked;
		},
	},
	data() {
		return {
			state: null,
		};
	},
	computed: {
		isChecked() {
			return this.state === null ? this.checked === true : this.state;
		},
		className() {
			return (
				'checkbox checkbox--' +
				(this.isChecked ? 'checked' : 'unchecked')
			);
		},
		icon() {
			return this.isChecked ? checkedIcon : uncheckedIcon;
		},
	},
};
</script>
