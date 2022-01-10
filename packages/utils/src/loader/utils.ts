import { installPackage } from '@antfu/install-pkg';
import { Awaitable, sleep } from '@antfu/utils';
import { cyan, yellow } from 'kolorist';
import type { IconCustomizer } from './types';

const warned = new Set<string>();

export function warnOnce(msg: string): void {
	if (!warned.has(msg)) {
		warned.add(msg);
		console.warn(yellow(`[@iconify-loader] ${msg}`));
	}
}

let pending: Promise<void> | undefined;
const tasks: Record<string, Promise<void> | undefined> = {};

export async function mergeIconProps(
	svg: string,
	collection: string,
	icon: string,
	additionalProps: Record<string, string | undefined>,
	propsProvider?: () => Awaitable<Record<string, string>>,
	iconCustomizer?: IconCustomizer
): Promise<string> {
	const props: Record<string, string> = (await propsProvider?.()) ?? {};
	await iconCustomizer?.(collection, icon, props);
	Object.keys(additionalProps).forEach((p) => {
		const v = additionalProps[p];
		if (v !== undefined && v !== null) props[p] = v;
	});
	const replacement = svg.startsWith('<svg ') ? '<svg ' : '<svg';
	return svg.replace(
		replacement,
		`${replacement}${Object.keys(props)
			.map((p) => `${p}="${props[p]}"`)
			.join(' ')}`
	);
}

export async function tryInstallPkg(name: string): Promise<void | undefined> {
	if (pending) {
		await pending;
	}

	if (!tasks[name]) {
		// eslint-disable-next-line no-console
		console.log(cyan(`Installing ${name}...`));
		tasks[name] = pending = installPackage(name, {
			dev: true,
			preferOffline: true,
		})
			.then(() => sleep(300))
			// eslint-disable-next-line
			.catch((e: any) => {
				warnOnce(`Failed to install ${name}`);
				console.error(e);
			})
			.finally(() => {
				pending = undefined;
			});
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return tasks[name]!;
}
