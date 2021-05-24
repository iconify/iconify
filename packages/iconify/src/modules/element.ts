import { IconifyIconName } from '@iconify/core/lib/icon/name';
import { IconifyIconCustomisations } from '@iconify/utils/lib/customisations';
import { IconifyFinder } from '../finders/interface';

/**
 * Icon status
 */
type IconStatus = 'missing' | 'loading' | 'loaded';

/**
 * Data added to element to keep track of attribute changes
 */
export interface IconifyElementData {
	name: IconifyIconName;
	status: IconStatus;
	customisations: IconifyIconCustomisations;
}

/**
 * Extend Element type to allow TypeScript understand added properties
 */
interface IconifyElementStoredFinder {
	iconifyFinder: IconifyFinder;
}

interface IconifyElementStoredData {
	iconifyData: IconifyElementData;
}

export interface IconifyElement
	extends HTMLElement,
		IconifyElementStoredData,
		IconifyElementStoredFinder {}

/**
 * Names of properties to add to nodes
 */
export const elementFinderProperty: keyof IconifyElementStoredFinder =
	('iconifyFinder' + Date.now()) as keyof IconifyElementStoredFinder;

export const elementDataProperty: keyof IconifyElementStoredData =
	('iconifyData' + Date.now()) as keyof IconifyElementStoredData;
