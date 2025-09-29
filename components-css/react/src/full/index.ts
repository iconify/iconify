import './init.js';
import { useMemo, createElement, useState, useEffect } from 'react';
import type { JSX } from 'react';
import type { CSSIconElementProps } from '../props.js';
import type { IconifyIcon } from '@iconify/types';
import { renderContent } from '@iconify/component-utils/helpers/content';
import { subscribeToIconData } from '@iconify/component-utils/icons/subscribe';
import { cleanUpInnerHTML } from '@iconify/utils/lib/svg/inner-html';
import { getSizeProps } from '@iconify/component-utils/helpers/size';
import { renderCSS } from './status.js';

/**
 * Basic icon component, without fallback
 *
 * Can be used when you do not need a fallback icon
 */
export function Icon({
	content,
	fallback,
	width,
	height,
	viewBox,
	...props
}: CSSIconElementProps): JSX.Element {
	// Data for icon to render
	const [iconData, setIconData] = useState<IconifyIcon | null | undefined>(
		null
	);
	const [subscriberState, setSubscriber] = useState<ReturnType<
		typeof subscribeToIconData
	> | null>(null);

	// Content
	const renderedContent = useMemo(
		() => renderContent(content || ''),
		[content]
	);

	// Icon to render from API, set to empty string if CSS rendering is used
	const fallbackToRender = useMemo(
		() => (renderCSS && content ? '' : fallback || ''),
		[content, fallback]
	);

	// Subscribe to icon data updates and watch prop changes
	useEffect(() => {
		const subscriber = subscribeToIconData(fallbackToRender, setIconData);
		setIconData(subscriber.data);
		setSubscriber(subscriber);
		return subscriber.unsubscribe;
	}, []);
	useEffect(() => {
		subscriberState?.change(fallbackToRender);
	}, [fallbackToRender]);

	// Render fallback icon
	const fallbackIcon = useMemo(() => {
		return iconData ? renderContent(iconData) : '';
	}, [iconData]);

	// Icon size
	const size = useMemo(
		() => getSizeProps(width, height, viewBox),
		[width, height, viewBox]
	);

	// Content
	const finalContent = useMemo(() => {
		return fallbackIcon || renderedContent;
	}, [fallbackIcon, renderedContent]);

	// Render icon
	return createElement('svg', {
		xmlns: 'http://www.w3.org/2000/svg',
		...size,
		...props,
		dangerouslySetInnerHTML: {
			__html: cleanUpInnerHTML(finalContent),
		},
	});
}
