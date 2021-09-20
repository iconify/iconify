# ES Builder

This is a library for transpiling TypeScript files.

It is not a bundler! It builds libraries that export multiple single files, not bundles.

What does it do?

-   Creates both ES and CommonJS modules in target directory. CommonJS files use '.js' extension, ES files use '.mjs' extension.
-   Creates TypeScript definition files for each file.
-   Rewrites imports paths in ES modules.
-   Updates exports field in package.json
-   Tests ES imports

Why is it needed?

-   ES modules should have full import paths, including extension, but TypeScript compiler cannot rewrite imports, so it cannot change target extension, so `tsc` cannot be reliably used to create ES modules.
-   Using other tools, such as `esbuild` requires custom plugin. This package is used by multiple packages, so it makes sense to split code into a separate package to make it easily reusable.
-   Currently `tsup` is the only viable alternative, but it is meant to be used as bundler. Without bundle option it currently fails to generate TypeScript definition files.
-   Reusable functions for updating package.json and for testing ES imports.

## Documentation

Requirements for using build process:

-   Create `tsconfig.json` that creates CommonJS modules, saves declarations, has `importsNotUsedAsValues` set to `error`.
-   Add script to `package.json` for building source code, such as `"build:source": "tsc -b",`. If you have multipe

To build packages, create `build.js` in your package:

```js
/* eslint-disable */
const { buildFiles } = require('@iconify/library-builder');

buildFiles({
	root: __dirname,
	source: './src',
	target: './lib',
})
	.then(() => {
		console.log('Done');
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
```

Source and target paths must be relative to root directory and start with `./`.

## License

The library is released with MIT license.

© 2021 Vjacheslav Trushkin / Iconify OÜ
