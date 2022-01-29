import { actionOptions } from './options';

export function consoleLog(...args: unknown[]) {
	if (!actionOptions.silent) {
		console.log(...args);
	}
}

export function consoleError(...args: unknown[]) {
	if (!actionOptions.silent) {
		console.error(...args);
	}
}
