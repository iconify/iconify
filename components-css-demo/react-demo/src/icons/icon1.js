import { Icon } from '@iconify/css-react';
import { createElement, useMemo } from 'react';
import { namedStateValue } from './helpers/named-state-value.js';
import { getFallback } from './helpers/fallback-ay9wndypfp.js';
import './css/ona74n.css';
import './css/mfq4_u.css';
import './css/mfxbmu.css';
import './css/fabh7v.css';
import './css/ek9rqv.css';
import './css/so-from-74.css';
import './css/so-to-0.css';

const viewBox = {"width":22,"height":24};

function Component({halign, valign, focus, width, height, ...props}) {
	const states = useMemo(() => ({ 'halign': namedStateValue(halign, 'left'), 'valign': namedStateValue(valign, 'top'), 'focus': focus }), [halign, valign, focus]);
	const fallback = useMemo(() => getFallback(["animated-line-24:align-box-",{"state":"halign"},"-",{"state":"valign"}], states), [states]);
	const className = useMemo(() => Object.entries(states).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' '), [states]);
	return createElement(Icon, {
		...props,
		className,
		width,
		height,
		viewBox,
		"content": `<path class="fabh7v mfq4_u ona74n"/><path class="ek9rqv mfxbmu ona74n"/>`,
		fallback,
	});
}

export default Component;
