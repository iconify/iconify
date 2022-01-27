/**
 * This script installs all dependencies and creates symbolic links for all packages inside monorepo.
 */
const { build } = require('./build');

build()
	.then((functions) => {
		functions.installAllPackages();
		functions.fixLinks();
	})
	.catch((err) => {
		process.exit(err);
	});
