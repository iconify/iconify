import type { CustomCollectionIconLoader, CustomHMRIconLoader } from '../lib/loader/types';
import { FileSystemHMRIconLoader } from '../lib/loader/node-loaders';
import { createHMRHelper, normalizePath } from '../lib/loader/hmr-utils';
import path from 'path';

const fixturesDir = './tests/fixtures';
const circlePath = normalizePath(path.resolve(fixturesDir, 'circle.svg'));
const resolvedCircleName = '~icons/custom/circle';
const ModuleNodeSim = 'module-name-for-circle';

function createUnpluginIconTest() {
	const customCollections: Record<string, CustomCollectionIconLoader> = {
		...FileSystemHMRIconLoader(fixturesDir, 'custom'),
	}
	/**
	 * Simulate Vite handleHotUpdate at unplugin-icons:
	 * - ctx.file: the file that changed, in this case the circle.svg
	 * - mGraph.getModuleById: will resolve the id associated with the virtual icon name, in this case ~icons/custom/circle
	 * - unplugin-icons will resolve the static import from the consumer, and will return a new virtual with the SVG content or the component
	 * - moduleDependency: it is the node module in the graph, it is just a string in the test to simulate ~icons/custom/circle being resolved
	 *
	 * ```ts
	 * async handleHotUpdate(ctx) {
	 *     const mGraph = ctx.server.moduleGraph
	 *     const modules = await resolved.then(({
	 *         invalidateHMR,
	 *     }) => invalidateHMR(
	 *         ctx.file,
	 *         id => mGraph.getModuleById(id),
	 *     ))
	 *     return modules?.length ? modules : undefined
	 * }
	 * ```
	 */
	const moduleGraph = new Map<string, string>([[resolvedCircleName, ModuleNodeSim ]]);
	function getModuleById(id: string): string | undefined {
		return moduleGraph.get(id);
	}
	// logic at invalidateHMR passing the filter as second argument to invalidateHMR
	function collectVirtualIconModuleNames<T>(
		collection: string,
		icon: string
	): T[] | undefined {
		return [
			`~icons/${collection}/${icon}`,
			`virtual:icons/${collection}/${icon}`,
			`virtual/icons/${collection}/${icon}`,
		].map(getModuleById).filter(Boolean) as T[]
	}

	const { hmrCustomIconResolvers, resolveModuleIconName } = createHMRHelper<string>(
		collectVirtualIconModuleNames,
		customCollections,
	);
	return { loader: hmrCustomIconResolvers[0] as CustomHMRIconLoader, resolveModuleIconName };
}

describe('Testing FileSystemHMRIconLoader', () => {
	test('FileSystemHMRIconLoader', async () => {
		const { loader, resolveModuleIconName } = createUnpluginIconTest();
		const resultPromise = loader.iconLoader('circle');
		await expect(resultPromise).resolves.not.toThrow();
		const result = await resultPromise;
		expect(result && result.indexOf('svg') > -1).toBeTruthy();
		const virtualIconNamePromise = resolveModuleIconName(circlePath)
		await expect(virtualIconNamePromise).resolves.not.toThrow();
		const virtualIconName = await virtualIconNamePromise;
		expect(virtualIconName).toBeDefined();
		expect(virtualIconName!).toHaveLength(1);
		expect(virtualIconName![0]).toBe(ModuleNodeSim);
	});
});
