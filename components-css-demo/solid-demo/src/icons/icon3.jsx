import { Icon } from '@iconify/css-solid';
import { createMemo, splitProps } from 'solid-js';
import { namedStateValue } from './helpers/named-state-value.js';
import { getFallback } from './helpers/fallback-r634mh5fxu.js';
import './css/reacnl.css';
import './css/zxndow.css';
import './css/iy2otu.css';
import './css/l-actj.css';
import './css/nf43cj.css';
import './css/omafcw.css';
import './css/c807hd.css';
import './css/lsejuv.css';
import './css/z3aezd.css';
import './css/b9a3-f.css';
import './css/zcx7gx.css';
import './css/mc7__g.css';
import './css/r1menc.css';
import './css/sh2p6x.css';
import './css/rg1nfv.css';
import './css/al390y.css';
import './css/ia15ro.css';
import './css/df7-9f.css';
import './css/td9rkk.css';
import './css/t50njl.css';
import './css/fade-to-1.css';
import './css/so-from-28.css';
import './css/so-from-44.css';
import './css/so-from-18.css';
import './css/so-from-34.css';
import './css/so-to-0.css';

const viewBox = {"width":24,"height":24};
const content = `<defs><mask id="SVG5vqpYcTc"><path class="mc7__g reacnl"/><path class="iy2otu r1menc sh2p6x zxndow"/><path class="iy2otu r1menc rg1nfv zxndow"/><path class="l-actj nf43cj"/><path class="al390y ia15ro r1menc"/></mask><mask id="SVG5lwb9bGv"><path class="mc7__g omafcw"/><path class="df7-9f iy2otu r1menc zxndow"/><path class="c807hd nf43cj"/><path class="al390y ia15ro r1menc"/></mask><mask id="SVG0TyOKeaR"><path class="iy2otu r1menc td9rkk zxndow"/><path class="iy2otu r1menc t50njl zxndow"/><path class="c807hd nf43cj"/><path class="al390y ia15ro r1menc"/></mask></defs><path mask="url(#SVG5vqpYcTc)" class="lsejuv z3aezd"/><path mask="url(#SVG5lwb9bGv)" class="lsejuv z3aezd"/><path mask="url(#SVG0TyOKeaR)" class="b9a3-f lsejuv"/><path class="ia15ro iy2otu r1menc zcx7gx"/>`;

/** @param props {{mode?: 'auto' | 'light' | 'dark'; fill?: 'no-fill' | 'light-filled' | 'dark-filled' | 'filled'; focus?: boolean; width?: string; height?: string;}} */
function Component(props) {
	const [local, others] = splitProps(props, ["mode","fill","focus","width","height"]);

	const states = createMemo(() => ({ 'mode': namedStateValue(local['mode'], 'auto'), 'fill': namedStateValue(local['fill'], 'no-fill'), 'focus': local['focus'] }));
	const fallback = createMemo(() => getFallback(["animated-line-24:color-scheme-",{"state":"mode"},"-",{"state":"fill"}],states()));
	const className = createMemo(() => Object.entries(states()).map(([key, value]) => value ? `state-${value === true ? key : value}` : '').join(' ').trim() || undefined);
	return (<Icon class={className()} width={local.width} height={local.height} viewBox={viewBox} content={content} fallback={fallback()} {...others} />);
}

export default Component;
