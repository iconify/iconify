import { Config } from 'tailwindcss/types/config';
import { PluginCreator } from 'tailwindcss/types/config';

/**
 * Formatting modes. Same as in SASS
 */
declare type CSSFormatMode = 'expanded' | 'compact' | 'compressed';

/**
 * Formatting options
 */
declare interface IconCSSFormatOptions {
    format?: CSSFormatMode;
}

/**
 * Selector for icon
 */
declare interface IconCSSIconSelectorOptions {
    pseudoSelector?: boolean;
    iconSelector?: string;
}

/**
 * Options for generating multiple icons
 */
declare interface IconCSSIconSetOptions extends IconCSSSharedOptions, IconCSSSelectorOptions, IconCSSModeOptions, IconCSSFormatOptions {
}

/**
 * Icon mode
 */
declare type IconCSSMode = 'mask' | 'background';

/**
 * Mode
 */
declare interface IconCSSModeOptions {
    mode?: IconCSSMode;
}

/**
 * Selector for icon when generating data from icon set
 */
declare interface IconCSSSelectorOptions extends IconCSSIconSelectorOptions {
    commonSelector?: string;
    overrideSelector?: string;
}

/**
 * Options common for both multiple icons and single icon
 */
declare interface IconCSSSharedOptions {
    varName?: string | null;
    forceSquare?: boolean;
    color?: string;
}

/**
 * Iconify plugin
 */
declare function iconifyPlugin(icons: string[] | string, options?: IconifyPluginOptions): {
    handler: PluginCreator;
    config?: Partial<Config>;
};
export default iconifyPlugin;

export declare interface IconifyPluginOptions extends IconCSSIconSetOptions {
}

export { }
