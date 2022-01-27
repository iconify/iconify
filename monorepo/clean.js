const { build } = require('./build');

build()
	.then((functions) => {
		functions.cleanWorkspaces();
	})
	.catch((err) => {
		process.exit(err);
	});
