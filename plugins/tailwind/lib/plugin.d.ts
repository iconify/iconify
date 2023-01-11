import type { IconifyPluginOptions } from './options';
/**
 * Iconify plugin
 */
declare function iconifyPlugin(icons: string[] | string, options?: IconifyPluginOptions): {
    handler: import("tailwindcss/types/config").PluginCreator;
    config?: Partial<import("tailwindcss/types/config").Config>;
};
/**
 * Export stuff
 */
export default iconifyPlugin;
export type { IconifyPluginOptions };
