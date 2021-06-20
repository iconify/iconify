import { Icon, getIcon, loadIcons } from '@iconify/vue';
import { h, defineComponent, ref } from 'vue';

export default defineComponent({
	components: {
		Icon,
	},
	props: ['icon'],
	setup() {
		// Variable to store function to cancel loading
		const loader = ref(null);

		// Icon data
		const data = ref(null);

		// Function to check icon data
		const check = (icon: string) => {
			const iconData = getIcon(icon);

			// Cancel old loder
			if (loader.value) {
				loader.value();
				loader.value = null;
			}

			if (iconData) {
				data.value = iconData;
			} else {
				loader.value = loadIcons([icon], () => {
					data.value = getIcon(icon);
				});
			}
		};
		return {
			loader,
			data,
			check,
		};
	},
	watch: {
		icon: {
			immediate: true,
			handler(value) {
				// Check new value
				this.check(value);
			},
		},
	},
	// Stop loading
	unmounted() {
		const loader = this.loader.value;
		if (loader) {
			loader();
		}
	},
	render() {
		const icon = this.data;
		if (icon) {
			return h(Icon, {
				icon,
			});
		}
		return this.$slots.default ? this.$slots.default() : null;
	},
});
