/**
 * Iconify interface
 */
export interface IconifyObserver {
	/**
	 * Pause DOM observer
	 */
	pauseObserver: () => void;

	/**
	 * Resume DOM observer
	 */
	resumeObserver: () => void;
}
