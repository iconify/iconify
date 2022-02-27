import { yellow } from 'kolorist';

const warned = new Set<string>();

export function warnOnce(msg: string): void {
	if (!warned.has(msg)) {
		warned.add(msg);
		console.warn(yellow(`[@iconify-loader] ${msg}`));
	}
}
