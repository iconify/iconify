import { defineComponent } from 'vue';
import {
	VNode,
	DefineComponent,
	ComponentOptionsMixin,
	EmitsOptions,
	VNodeProps,
	AllowedComponentProps,
	ComponentCustomProps,
} from 'vue';
import { IconifyIcon, IconifyJSON } from '@iconify/types';
import {
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconSize,
} from '@iconify/core/lib/customisations';
import { fullIcon } from '@iconify/core/lib/icon';
import { parseIconSet } from '@iconify/core/lib/icon/icon-set';
import {
	IconifyIconCustomisations,
	IconifyIconProps,
	IconProps,
} from './props';
import { render } from './render';

/**
 * Export stuff from props.ts
 */
export { IconifyIconCustomisations, IconifyIconProps, IconProps };

/**
 * Export types that could be used in component
 */
export {
	IconifyIcon,
	IconifyJSON,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconSize,
};

/**
 * Storage for icons referred by name
 */
const storage: Record<string, Required<IconifyIcon>> = Object.create(null);

/**
 * Add icon to storage, allowing to call it by name
 *
 * @param name
 * @param data
 */
export function addIcon(name: string, data: IconifyIcon): void {
	storage[name] = fullIcon(data);
}

/**
 * Add collection to storage, allowing to call icons by name
 *
 * @param data Icon set
 * @param prefix Optional prefix to add to icon names, true (default) if prefix from icon set should be used.
 */
export function addCollection(
	data: IconifyJSON,
	prefix?: string | boolean
): void {
	const iconPrefix: string =
		typeof prefix === 'string'
			? prefix
			: prefix !== false && typeof data.prefix === 'string'
			? data.prefix + ':'
			: '';
	parseIconSet(data, (name, icon) => {
		if (icon !== null) {
			storage[iconPrefix + name] = icon;
		}
	});
}

/**
 * Component
 */
export const Icon = defineComponent({
	// Do not inherit other attributes: it is handled by render()
	inheritAttrs: false,

	// Render icon
	render() {
		const props = this.$attrs;

		// Check icon
		const icon =
			typeof props.icon === 'string'
				? storage[props.icon]
				: typeof props.icon === 'object'
				? fullIcon(props.icon)
				: null;

		// Validate icon object
		if (
			icon === null ||
			typeof icon !== 'object' ||
			typeof icon.body !== 'string'
		) {
			return this.$slots.default ? this.$slots.default() : null;
		}

		// Valid icon: render it
		return render(icon, props);
	},
});
