const regex = /\sid="(\S+)"/g;

const counters = /* @__PURE__ */ new Map();

function nextID(id) {
	id = id.replace(/[0-9]+$/, '') || 'a';
	const count = counters.get(id) || 0;
	counters.set(id, count + 1);
	return count ? `${id}${count}` : id;
}

export function replaceIDs(body) {
	const ids = [];
	let match;
	while ((match = regex.exec(body))) ids.push(match[1]);
	if (!ids.length) return body;
	const suffix = 'suffix' + ((Math.random() * 16777216) | Date.now()).toString(16);
	ids.forEach((id) => {
		const newID = nextID(id);
		const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		body = body.replace(
			new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', 'g'),
			'$1' + newID + suffix + '$3'
		);
	});
	body = body.replace(new RegExp(suffix, 'g'), '');
	return body;
}
