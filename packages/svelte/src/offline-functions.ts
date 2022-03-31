import type { IconifyIcon, IconifyJSON } from '@iconify/types';
import { fullIcon } from '@iconify/utils/lib/icon';
import { parseIconSet } from '@iconify/utils/lib/icon-set/parse';
import { quicklyValidateIconSet } from '@iconify/utils/lib/icon-set/validate-basic';
import { render } from './render';
import type { RenderResult } from './render';
import type { IconProps } from './props';

/**
 * Storage for icons referred by name
 */
const storage: Record<string, Required<IconifyIcon>> = Object.create(null);

/**
 * Generate icon
 */
export function generateIcon(props: IconProps): RenderResult | null {
	// Split properties
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
		return null;
	}

	return render(icon, props);
}

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
	quicklyValidateIconSet(data) &&
		parseIconSet(data, (name, icon) => {
			if (icon) {
				storage[iconPrefix + name] = icon;
			}
		});
}
