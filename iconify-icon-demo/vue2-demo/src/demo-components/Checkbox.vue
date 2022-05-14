<template>
	<div class="checkbox-container">
		<a href="# " :class="className" @click="check">
			<iconify-icon :icon="icon" />{{ text }}
		</a>
		<small>{{ hint }}</small>
	</div>
</template>

<script>
import checkedIcon from '@iconify-icons/bx/bx-checkbox-checked';
import uncheckedIcon from '@iconify-icons/bx/bx-checkbox';

export default {
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
			return JSON.stringify(this.isChecked ? checkedIcon : uncheckedIcon);
		},
	},
};
</script>
