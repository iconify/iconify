let policy;

function createPolicy() {
	try {
		policy = window.trustedTypes.createPolicy('iconify', {
			createHTML: (s) => s,
		});
	} catch (err) {
		policy = null;
	}
}

export function cleanupHTML(html) {
	if (policy === undefined) {
		createPolicy();
	}

	return policy ? policy.createHTML(html) : html;
}
