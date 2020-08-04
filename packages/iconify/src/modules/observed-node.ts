/**
 * Callback
 */
export type GetHTMLElement = () => HTMLElement | null;

/**
 * Observed node type
 */
export interface ObservedNode {
	// Node
	node: HTMLElement | GetHTMLElement;

	// True if node should be removed when all placeholders have been replaced
	temporary?: boolean;

	// Observer data
	observer?: {
		// MutationObserver instance
		instance?: MutationObserver;

		// Number instead of boolean to allow multiple pause/resume calls. Observer is resumed only when pause reaches 0
		paused: number;

		// Timer for pending scan
		pendingScan?: number;
	};
}
