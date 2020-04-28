import { IconifyLoadIcons } from './loader';

/**
 * Function to check if icon is pending
 */
export type IsPending = (prefix: string, name: string) => boolean;

/**
 * API interface
 */
export interface IconifyAPI {
	isPending: IsPending;
	loadIcons: IconifyLoadIcons;
}
