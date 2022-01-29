import { Icon, iconExists, loadIcons } from '@iconify/vue';
import { h, defineComponent, ref } from 'vue';

export default defineComponent({
	components: {
		Icon,
	},
	props: ['icon'],
	setup() {
		// Variable to store function to cancel loading
		const loader = ref(null);

		// Icon status
		const loaded = ref(null);

		// Function to check if icon exists
		const check = (icon: string) => {
			const isLoaded = (loaded.value = iconExists(icon));

			// Cancel old loder
			if (loader.value) {
				loader.value();
				loader.value = null;
			}

			if (!isLoaded) {
				loader.value = loadIcons([icon], () => {
					loaded.value = iconExists(icon);
				});
			}
		};
		return {
			loader,
			loaded,
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
		const loaded = this.loaded;
		if (loaded) {
			return h(Icon, {
				icon: this.icon,
			});
		}
		return this.$slots.default ? this.$slots.default() : null;
	},
});
