import { IconifyElement } from '../element';
import { IconifyIconName } from '@iconify/core/lib/icon/name';
import { IconifyIconCustomisations } from '@iconify/core/lib/customisations';

/**
 * find - find elements that match plugin within root element
 */
export type IconifyFinderFind = (root: HTMLElement) => NodeList;

/**
 * name - get icon name from element
 */
export type IconifyFinderName = (
	element: IconifyElement
) => IconifyIconName | string | null;

/**
 * customisations - get icon customisations
 */
export type IconifyFinderCustomisations = (
	element: IconifyElement,
	defaultVaues?: IconifyIconCustomisations
) => IconifyIconCustomisations;

/**
 * classes - filter class list
 */
export type IconifyFinderClassFilter = (
	// Classes to filter
	classList: string[]
) => string[];

/**
 * Interface for finder module
 */
export interface IconifyFinder {
	find: IconifyFinderFind;
	name: IconifyFinderName;
	customisations: IconifyFinderCustomisations;
	classFilter: IconifyFinderClassFilter;
}
