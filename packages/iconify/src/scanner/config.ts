import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type { IconifyIconCustomisations } from '@iconify/utils/lib/customisations';

/**
 * Class names
 */
export const blockClass = 'iconify';
export const inlineClass = 'iconify-inline';

/**
 * Icon render mode
 *
 * 'style' = 'bg' or 'mask', depending on icon content
 * 'bg' = inline style using `background`
 * 'mask' = inline style using `mask`
 * 'inline' = inline SVG.
 */
export type IconRenderMode = 'style' | 'bg' | 'mask' | 'inline';

/**
 * Data used to verify if icon is the same
 */
export interface IconifyElementProps {
	// Icon name as string
	name: string;

	// Icon name as object
	icon: IconifyIconName;

	// Customisations
	customisations: Required<IconifyIconCustomisations>;

	// Render mode
	mode?: IconRenderMode;
}

/**
 * Icon status
 */
type IconStatus = 'missing' | 'loading' | 'loaded';

/**
 * List of classes added to element
 *
 * If class already exists in element, it is not included in list
 */
export type IconifyElementAddedClasses = string[];

/**
 * List of added inline styles
 *
 * Style is not changed if custom value is set
 */
export type IconifyElementChangedStyles = string[];

/**
 * Data added to element to keep track of changes
 */
export interface IconifyElementData extends IconifyElementProps {
	// Status
	status: IconStatus;

	// List of classes that were added to element on last render
	addedClasses?: IconifyElementAddedClasses;

	// List of changes to style on last render
	addedStyles?: IconifyElementChangedStyles;
}

/**
 * Extend Element type to allow TypeScript understand added properties
 */
interface IconifyElementStoredData {
	iconifyData?: IconifyElementData;
}

export interface IconifyElement extends HTMLElement, IconifyElementStoredData {}

/**
 * Names of properties to add to nodes
 */
export const elementDataProperty: keyof IconifyElementStoredData =
	('iconifyData' + Date.now()) as keyof IconifyElementStoredData;
