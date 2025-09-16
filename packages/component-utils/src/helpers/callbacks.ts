type Callback = () => unknown;

const queue = new Set<Callback>();
let isPending = false;

/**
 * Parse callback
 */
function parseCallback(callback: Callback) {
	try {
		const result = callback();
		if (result instanceof Promise) {
			result.catch((error) => {
				console.error(error);
			});
		}
	} catch (error) {
		console.error(error);
	}
}

/**
 * Asynchronous callback trigger
 */
export function triggerCallbackAsync(callback: Callback, instant = false) {
	if (instant) {
		parseCallback(callback);
		return;
	}

	queue.add(callback);
	if (!isPending) {
		isPending = true;
		setTimeout(() => {
			isPending = false;
			const callbacks = Array.from(queue);
			queue.clear();
			callbacks.forEach(parseCallback);
		});
	}
}
