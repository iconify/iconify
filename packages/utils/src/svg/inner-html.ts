// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
interface Policy {
	createHTML: (s: string) => string;
}

let policy: undefined | null | Policy;

/**
 * Attempt to create policy
 */
function createPolicy() {
	try {
		policy = window.trustedTypes.createPolicy('iconify', {
			createHTML: (s) => s,
		}) as Policy;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		policy = null;
	}
}

/**
 * Clean up value for innerHTML assignment
 *
 * This code doesn't actually clean up anything.
 * It is intended be used with Iconify icon data, which has already been validated
 */
export function cleanUpInnerHTML(html: string): string {
	if (policy === undefined) {
		createPolicy();
	}

	return policy ? (policy.createHTML(html) as unknown as string) : html;
}
