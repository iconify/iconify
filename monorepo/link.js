/**
 * This script creates symbolic links for all packages inside monorepo.
 *
 * `lerna link --force-local` does not link dependencies of dependencies, but this fix does.
 */
const { build } = require('./build');

build()
	.then((functions) => {
		functions.fixLinks();
	})
	.catch((err) => {
		process.exit(err);
	});
