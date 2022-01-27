/**
 * This script removes symbolic links for all packages inside monorepo.
 */
const { build } = require('./build');

build()
	.then((functions) => {
		functions.removeLinks();
	})
	.catch((err) => {
		process.exit(err);
	});
