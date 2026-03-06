import { Icon } from '@iconify/css-react';
import { createElement, useMemo } from 'react';
import { namedStateValue } from './helpers/named-state-value.js';
import { getFallback } from './helpers/fallback-ay9wndypfp.js';
import './css/u2mluk.css';
import './css/ona74n.css';
import './css/b6dtxa.css';
import './css/so-from-74.css';
import './css/so-to-0.css';

const viewBox = {"width":22,"height":24};

interface Props {
	halign?: 'left' | 'center' | 'right';
	valign?: 'top' | 'middle' | 'bottom' | 'stretch';
	focus?: boolean;
	width?: string;
	height?: string;
};

function Component({halign, valign, focus, width, height, ...props}: Props) {
	const states = useMemo(() => ({ 'halign': namedStateValue(halign, 'left'), 'valign': namedStateValue(valign, 'top'), 'focus': focus }), [halign, valign, focus]);
	const fallback = useMemo(() => getFallback(["animated-line-24:align-box-",{"state":"halign"},"-",{"state":"valign"}], states), [states]);
	const className = useMemo(() => Object.entries(states).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' ').trim() || undefined, [states]);
	return createElement(Icon, {
		...props,
		className,
		width,
		height,
		viewBox,
		"content": `<path class="ona74n u2mluk"/><path class="b6dtxa ona74n"/>`,
		fallback,
	});
}

export default Component;
