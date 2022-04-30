// Customisations
export { compare as compareCustomisations } from './customisations/compare';
export {
	defaults as defaultCustomisations,
	mergeCustomisations,
} from './customisations/index';

// Customisations: converting attributes in components
export { toBoolean } from './customisations/bool';
export { flipFromString } from './customisations/flip';
export { rotateFromString } from './customisations/rotate';

// Icon names
export { stringToIcon, validateIcon as validateIconName } from './icon/name';
export { matchName as matchIconName } from './icon/index';

// Icon data
export { mergeIconData } from './icon/merge';
export {
	iconDefaults as defaultIconData,
	fullIcon as fullIconData,
} from './icon/index';

// Icon set functions
export { parseIconSet, isVariation } from './icon-set/parse';
export { validateIconSet } from './icon-set/validate';
export { quicklyValidateIconSet } from './icon-set/validate-basic';
export { expandIconSet } from './icon-set/expand';
export { minifyIconSet } from './icon-set/minify';
export { getIcons } from './icon-set/get-icons';
export { getIconData } from './icon-set/get-icon';

// Icon set: convert information
export { convertIconSetInfo } from './icon-set/convert-info';

// Build SVG
export { iconToSVG } from './svg/build';
export { replaceIDs } from './svg/id';
export { calculateSize } from './svg/size';
export { encodeSvgForCss } from './svg/encode-svg-for-css';
export { trimSVG } from './svg/trim';
export { iconToHTML } from './svg/html';
export { svgToURL } from './svg/url';

// Colors
export { colorKeywords } from './colors/keywords';
export { stringToColor, compareColors, colorToString } from './colors/index';

// SVG Icon loader
export type {
	CustomIconLoader,
	CustomCollections,
	IconCustomizer,
	IconCustomizations,
	IconifyLoaderOptions,
	InlineCollection,
	UniversalIconLoader,
} from './loader/types';
export { mergeIconProps } from './loader/utils';
export { getCustomIcon } from './loader/custom';
export { searchForIcon } from './loader/modern';
export { loadIcon } from './loader/loader';

// Misc
export { camelize, camelToKebab, snakelize, pascalize } from './misc/strings';
