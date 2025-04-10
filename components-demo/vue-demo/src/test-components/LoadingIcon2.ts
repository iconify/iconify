import { Icon, iconLoaded, loadIcons } from '@iconify/vue';
import { h, defineComponent, shallowRef } from 'vue';

export default defineComponent({
	components: {
		Icon,
	},
	props: ['icon'],
	setup() {
		// Variable to store function to cancel loading
		const loader = shallowRef<ReturnType<typeof loadIcons> | null>(null);

		// Icon status
		const loaded = shallowRef<boolean | null>(null);

		// Function to check if icon exists
		const check = (icon: string) => {
			const isLoaded = (loaded.value = iconLoaded(icon));

			// Cancel old loder
			if (loader.value) {
				loader.value();
				loader.value = null;
			}

			if (!isLoaded) {
				loader.value = loadIcons([icon], () => {
					loaded.value = iconLoaded(icon);
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
