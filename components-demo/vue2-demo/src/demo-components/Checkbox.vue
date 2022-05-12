<template>
	<div class="checkbox-container">
		<a href="# " :class="className" @click="check">
			<Icon :icon="icon" />{{ text }}
		</a>
		<small>{{ hint }}</small>
	</div>
</template>

<script>
import { Icon } from '@iconify/vue2/dist/offline';
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
		check(event) {
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
