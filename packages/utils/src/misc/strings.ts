/**
 * Convert string to camelCase
 */
export function camelize(str: string): string {
	return str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
}

/**
 * Convert string to PascaleCase
 */
export function pascalize(str: string): string {
	const camel = camelize(str);
	return camel.slice(0, 1).toUpperCase() + camel.slice(1);
}

/**
 * Convert camelCase string to kebab-case
 */
export function camelToKebab(key: string): string {
	const result = key
		.replace(/:/g, '-')
		.replace(/([A-Z])/g, ' $1')
		.trim();
	return result.split(/\s+/g).join('-').toLowerCase();
}

/**
 * Convert camelCase string to snake-case
 */
export function snakelize(str: string): string {
	const kebab = camelToKebab(str);
	return kebab.replace(/-/g, '_');
}
