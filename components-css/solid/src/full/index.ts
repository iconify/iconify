import './init.js';
import {
	createEffect,
	createMemo,
	createSignal,
	splitProps,
	type JSX,
} from 'solid-js';
import { mergeProps, spread, template } from 'solid-js/web';
import type { CSSIconElementProps } from '../props.js';
import type { IconifyIcon } from '@iconify/types';
import { renderContent } from '@iconify/component-utils/helpers/content';
import { subscribeToIconData } from '@iconify/component-utils/icons/subscribe';
import { cleanUpInnerHTML } from '@iconify/utils/lib/svg/inner-html';
import { getSizeProps } from '@iconify/component-utils/helpers/size';
import { renderCSS } from './status.js';

const _tmpl$ = /* @__PURE__ */ template(
	`<svg xmlns=http://www.w3.org/2000/svg>`
);

/**
 * Basic icon component, without fallback
 *
 * Can be used when you do not need a fallback icon
 */
export function Icon(props: CSSIconElementProps): JSX.Element {
	const [local, others] = splitProps(props, [
		'content',
		'fallback',
		'width',
		'height',
		'viewBox',
	]);

	// Data for icon to render
	const [iconData, setIconData] = createSignal<
		IconifyIcon | null | undefined
	>(null);
	const [subscriberState, setSubscriber] = createSignal<ReturnType<
		typeof subscribeToIconData
	> | null>(null);

	// Content
	const renderedContent = createMemo(() =>
		renderContent(local.content || '')
	);

	// Icon to render from API, set to empty string if CSS rendering is used
	const fallbackToRender = createMemo(() =>
		renderCSS && local.content ? '' : local.fallback || ''
	);

	// Subscribe to icon data updates and watch prop changes
	createEffect(() => {
		const subscriber = subscribeToIconData(fallbackToRender(), setIconData);
		setIconData(subscriber.data);
		setSubscriber(subscriber);
		return subscriber.unsubscribe;
	}, []);
	createEffect(() => {
		subscriberState()?.change(fallbackToRender());
	}, [fallbackToRender]);

	// Render fallback icon
	const fallbackIcon = createMemo(() => {
		const data = iconData();
		return data ? renderContent(data) : '';
	});

	// Icon size
	const size = createMemo(() =>
		getSizeProps(local.width, local.height, local.viewBox)
	);

	// Content
	const finalContent = createMemo(() =>
		cleanUpInnerHTML(fallbackIcon() || renderedContent())
	);

	// Render icon
	return (() => {
		const _el$ = _tmpl$();
		spread(
			_el$,
			mergeProps(size, others, {
				get innerHTML() {
					return finalContent();
				},
			}),
			true,
			true
		);
		return _el$;
	})();
}
