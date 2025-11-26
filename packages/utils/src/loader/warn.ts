import { styleText } from 'node:util';

const warned = new Set<string>();

export function warnOnce(msg: string): void {
	if (!warned.has(msg)) {
		warned.add(msg);
		console.warn(styleText('yellow', `[@iconify-loader] ${msg}`));
	}
}
