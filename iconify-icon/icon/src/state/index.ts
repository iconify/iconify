import type { ActualRenderMode } from '../attributes/types';
import type {
	CurrentIconData,
	RenderedCurrentIconData,
} from '../attributes/icon/state';
import type { RenderedIconCustomisations } from '../attributes/customisations';

/**
 * Common attributes, rendered regardless of loading state
 */
interface BaseState {
	inline: boolean;
}

/**
 * Successful render
 */
export interface RenderedState extends BaseState {
	rendered: true;

	// Icon, including data
	icon: RenderedCurrentIconData;

	// Mode passed as attribute
	attrMode?: string;

	// Actual mode used to render icon
	renderedMode: ActualRenderMode;

	// Customisations
	customisations: RenderedIconCustomisations;
}

/**
 * Pending render
 */
export interface PendingState extends BaseState {
	rendered: false;

	// Icon, without data
	icon: CurrentIconData;

	// Last rendered state. Set if icon was not re-renderd, but new state is pending, such as new icon is being loaded.
	lastRender?: RenderedState;
}

/**
 * Icon
 */
export type IconState = RenderedState | PendingState;

/**
 * Set state to PendingState
 */
export function setPendingState(
	icon: CurrentIconData,
	inline: boolean,
	lastState?: IconState
): PendingState {
	const lastRender: RenderedState | undefined =
		lastState &&
		(lastState.rendered
			? lastState
			: (lastState as PendingState).lastRender);

	return {
		rendered: false,
		inline,
		icon,
		lastRender,
	};
}
