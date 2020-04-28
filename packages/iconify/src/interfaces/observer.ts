/**
 * Observer callback function
 */
export type ObserverCallback = (root: HTMLElement) => void;

/**
 * Observer functions
 */
type InitObserver = (callback: ObserverCallback) => void;
type PauseObserver = () => void;
type ResumeObserver = () => void;
type IsObserverPaused = () => boolean;

/**
 * Observer functions
 */
export interface Observer {
	init: InitObserver;
	pause: PauseObserver;
	resume: ResumeObserver;
	isPaused: IsObserverPaused;
}
