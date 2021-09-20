import { build } from 'esbuild';
import { locateImport } from './locate';
import type { RequiredBuildParams } from './params';

/**
 * Build files
 */
export async function runESBuild(params: RequiredBuildParams, files: string[]) {
	const { root, source, target, rebuildCommonJS } = params;

	const maxMode = rebuildCommonJS ? 2 : 1;
	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		for (let j = 0; j < maxMode; j++) {
			const esm = j === 0;
			const ext = esm ? '.mjs' : '.js';

			console.log('Building', file.slice(1) + ext);
			await build({
				entryPoints: [root + source + file + '.ts'],
				outfile: root + target + file + ext,
				format: esm ? 'esm' : 'cjs',
				bundle: true,
				plugins: [
					{
						name: 'rewrite-imports',
						setup(build) {
							build.onResolve({ filter: /.*/ }, (args) => {
								if (
									args.importer &&
									args.kind === 'import-statement' &&
									args.namespace === 'file'
								) {
									const result = locateImport(
										args.resolveDir,
										args.path
									);
									if (result) {
										return {
											external: true,
											path: result.file + ext,
										};
									}

									// External package
									if (args.path.slice(0, 1) !== '.') {
										return {
											external: true,
											path: args.path,
										};
									}

									// Debug
									console.log(args);
									throw new Error(
										`Cannot resolve ${args.path}`
									);
								}
							});
						},
					},
				],
			});
		}
	}
}
