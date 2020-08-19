import _Vue, { PluginFunction, VueConstructor, VNode, VNodeData } from 'vue';
import { FunctionalRenderContext } from 'vue/src/core';

import { IconifyIcon as IconifyIconData } from '@iconify/types';
import {
	IconifyIconCustomisations as IconCustomisations,
	FullIconCustomisations,
	defaults,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconSize,
} from '@iconify/core/lib/customisations';
import {
	flipFromString,
	alignmentFromString,
} from '@iconify/core/lib/customisations/shorthand';
import { rotateFromString } from '@iconify/core/lib/customisations/rotate';
import { fullIcon } from '@iconify/core/lib/icon';
import { iconToSVG } from '@iconify/core/lib/builder';
import { replaceIDs } from '@iconify/core/lib/builder/ids';
import { merge } from '@iconify/core/lib/misc/merge';

/**
 * Export types that could be used in component
 */
export {
	IconifyIconData,
	IconifyHorizontalIconAlignment,
	IconifyVerticalIconAlignment,
	IconifyIconSize,
};

// Allow rotation to be string
/**
 * Icon customisations
 */
export type IconifyIconCustomisations = IconCustomisations & {
	rotate?: string | number;
};

/**
 * Icon properties
 */
export interface IconifyIconProps extends IconifyIconCustomisations {
	icon: IconifyIconData;

	// Style
	color?: string;

	// Shorthand properties
	flip?: string;
	align?: string;

	// Aliases for alignment because "v-align" is treated like directive
	horizontalAlign?: IconifyHorizontalIconAlignment;
	verticalAlign?: IconifyVerticalIconAlignment;

	// Aliases for flip because "v-flip" is treated like directive
	horizontalFlip?: boolean;
	verticalFlip?: boolean;
}

// Interface for functional component context that is missing in Vue types.
// Missing some unused stuff: children, slots, scopedSlots, injections
// interface FunctionalRenderContext {
// 	props: { [key: string]: unknown };
// 	data?: VNodeData;
// 	parent?: VNode;
// 	listeners?: object; // alias of data.on
// }

/**
 * Default SVG attributes
 */
const svgDefaults = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlns:xlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
	'focusable': false,
	'role': 'img',
};

/**
 * Aliases for customisations.
 * In Vue 'v-' properties are reserved, so v-align and v-flip must be renamed
 */
const customisationAliases = {
	horizontalAlign: 'hAlign',
	verticalAlign: 'vAlign',
	horizontalFlip: 'hFlip',
	verticalFlip: 'vFlip',
};

/**
 * Storage for icons referred by name
 */
const storage: Record<string, Required<IconifyIconData>> = Object.create(null);

/**
 * Interface for style variable
 */
type VNodeStyle = (string | Record<string, unknown>)[];

/**
 * IconifyIcon component
 */
const IconifyIcon = {
	name: 'IconifyIcon',
	functional: true,

	/**
	 * Render icon
	 *
	 * @param createElement
	 * @param context
	 */
	render(
		createElement: typeof _Vue.prototype.$createElement,
		context: FunctionalRenderContext
	): VNode {
		const props = context.props;

		// Split properties
		const icon =
			typeof props.icon === 'string'
				? storage[props.icon]
				: fullIcon(props.icon);
		if (!icon) {
			return null;
		}

		const customisations = merge(
			defaults,
			props as IconifyIconCustomisations
		) as FullIconCustomisations;
		const componentProps = merge(svgDefaults);

		// Copy style
		let stylesList: VNodeStyle;
		let styleString: string;
		let isStyleString = false;
		let hasStyle = true;

		function setStyle(value: unknown): boolean {
			if (typeof value === 'string') {
				// Style as string
				styleString = value;
				isStyleString = true;
				return true;
			}
			if (typeof value !== 'object') {
				// Unknown type ???
				return false;
			}

			stylesList = value instanceof Array ? value.slice(0) : [value];
			return true;
		}

		const contextData = context.data;
		if (
			!contextData ||
			(!setStyle(contextData.staticStyle) && !setStyle(contextData.style))
		) {
			stylesList = [];
			hasStyle = false;
		}

		// Get element properties
		for (let key in props) {
			const value = props[key];
			switch (key) {
				// Properties to ignore
				case 'icon':
				case 'style':
					break;

				// Flip as string: 'horizontal,vertical'
				case 'flip':
					flipFromString(customisations, value);
					break;

				// Alignment as string
				case 'align':
					alignmentFromString(customisations, value);
					break;

				// Color: copy to style
				case 'color':
					if (isStyleString) {
						styleString = 'color: ' + value + '; ' + styleString;
					} else {
						stylesList.unshift({
							color: value,
						});
					}
					hasStyle = true;
					break;

				// Rotation as string
				case 'rotate':
					if (typeof value !== 'number') {
						customisations[key] = rotateFromString(value);
					} else {
						componentProps[key] = value;
					}
					break;

				// Remove aria-hidden
				case 'ariaHidden':
				case 'aria-hidden':
					// Vue transforms 'aria-hidden' property to 'ariaHidden'
					if (value !== true && value !== 'true') {
						delete componentProps['aria-hidden'];
					}
					break;

				default:
					if (customisationAliases[key] !== void 0) {
						// Aliases for customisations
						customisations[customisationAliases[key]] = value;
					} else if (defaults[key] === void 0) {
						// Copy missing property if it does not exist in customisations
						componentProps[key] = value;
					}
			}
		}

		// Generate icon
		const item = iconToSVG(icon, customisations);

		// Add icon stuff
		for (let key in item.attributes) {
			componentProps[key] = item.attributes[key];
		}

		if (item.inline) {
			if (isStyleString) {
				styleString = 'vertical-align: -0.125em; ' + styleString;
			} else {
				stylesList.unshift({
					verticalAlign: '-0.125em',
				});
			}
			hasStyle = true;
		}

		// Generate node data
		const data: VNodeData = {
			attrs: componentProps,
			domProps: {
				innerHTML: replaceIDs(item.body),
			},
		};
		if (hasStyle) {
			data.style = isStyleString ? styleString : stylesList;
		}

		if (contextData) {
			['on', 'ref'].forEach((attr) => {
				if (contextData[attr] !== void 0) {
					data[attr] = contextData[attr];
				}
			});
			['staticClass', 'class'].forEach((attr) => {
				if (contextData[attr] !== void 0) {
					data.class = contextData[attr];
				}
			});
		}

		return createElement('svg', data);
	},

	/**
	 * Add icon to storage that can later be used by name, for example: <iconify-icon icon="home" />
	 */
	addIcon: (name: string, data: IconifyIconData) => {
		storage[name] = fullIcon(data);
	},
};

// Install function
interface InstallFunction extends PluginFunction<unknown> {
	installed?: boolean;
}
interface InstallableComponent extends VueConstructor<_Vue> {
	install: InstallFunction;
}

const install: InstallFunction = function installIconifyIcon(Vue: typeof _Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component('IconifyIcon', IconifyIcon);
};

// Create module definition for Vue.use()
const plugin = {
	install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = ((global as unknown) as Record<string, unknown>).Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
((IconifyIcon as unknown) as InstallableComponent).install = install;

// Export component
export default IconifyIcon;
