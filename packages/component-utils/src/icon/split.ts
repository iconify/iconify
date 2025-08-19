import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type { IconsData } from './types.js';
import { stringToIcon } from '@iconify/utils/lib/icon/name';

/**
 * Get list of icon names by provider and prefix
 */
export function splitIconNames(
	names: (IconifyIconName | string)[],
	oldData?: IconsData<string[]>
): IconsData<string[]> {
	const results = oldData || (Object.create(null) as IconsData<string[]>);

	for (const iconName of names) {
		const icon =
			typeof iconName === 'string' ? stringToIcon(iconName) : iconName;
		if (icon) {
			const providerData =
				results[icon.provider] ||
				(results[icon.provider] = Object.create(null));
			const prefixData =
				providerData[icon.prefix] || (providerData[icon.prefix] = []);
			if (!prefixData.includes(icon.name)) {
				prefixData.push(icon.name);
			}
		}
	}

	return results;
}
