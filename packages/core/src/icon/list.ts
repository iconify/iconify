import { IconifyIconName, stringToIcon, validateIcon } from './name';

/**
 * Convert icons list from string/icon mix to icons and validate them
 */
export function listToIcons(
	list: (string | IconifyIconName)[],
	validate = true
): IconifyIconName[] {
	const result: IconifyIconName[] = [];

	list.forEach((item) => {
		const icon: IconifyIconName =
			typeof item === 'string'
				? (stringToIcon(item) as IconifyIconName)
				: item;
		if (!validate || validateIcon(icon)) {
			result.push({
				provider: icon.provider,
				prefix: icon.prefix,
				name: icon.name,
			});
		}
	});

	return result;
}

/**
 * Get all providers
 */
export function getProviders(list: IconifyIconName[]): string[] {
	const providers: Record<string, boolean> = Object.create(null);
	list.forEach((icon) => {
		providers[icon.provider] = true;
	});
	return Object.keys(providers);
}
