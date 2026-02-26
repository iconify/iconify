export function namedStateValue(value, defaultValue) {
	return value && value !== defaultValue ? value : undefined;
}