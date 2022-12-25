// Customisations
export {
	defaultIconCustomisations,
	defaultIconSizeCustomisations,
} from './customisations/defaults';
export type {
	IconifyIconSize,
	IconifyIconSizeCustomisations,
	IconifyIconCustomisations,
	FullIconCustomisations,
} from './customisations/defaults';
export { mergeCustomisations } from './customisations/merge';

// Customisations: converting attributes in components
export { toBoolean } from './customisations/bool';
export { flipFromString } from './customisations/flip';
export { rotateFromString } from './customisations/rotate';

// Icon names
export { matchIconName, stringToIcon, validateIconName } from './icon/name';
export type { IconifyIconName, IconifyIconSource } from './icon/name';

// Icon data
export { mergeIconData } from './icon/merge';
export { mergeIconTransformations } from './icon/transformations';
export {
	defaultIconProps,
	defaultIconDimensions,
	defaultIconTransformations,
	defaultExtendedIconProps,
} from './icon/defaults';
export type {
	IconifyIcon,
	FullIconifyIcon,
	PartialExtendedIconifyIcon,
	FullExtendedIconifyIcon,
} from './icon/defaults';

// Icon set functions
export { getIconsTree } from './icon-set/tree';
export type { ParentIconsList, ParentIconsTree } from './icon-set/tree';
export { parseIconSet } from './icon-set/parse';
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
export type { IconifyIconBuildResult } from './svg/build';
export { replaceIDs } from './svg/id';
export { calculateSize } from './svg/size';
export { encodeSvgForCss } from './svg/encode-svg-for-css';
export { trimSVG } from './svg/trim';
export { iconToHTML } from './svg/html';
export { svgToURL } from './svg/url';

// Colors
export { colorKeywords } from './colors/keywords';
export { stringToColor, compareColors, colorToString } from './colors/index';

// CSS generator
export { getIconCSS } from './css/icon';
export { getIconsCSS } from './css/icons';

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

// Emojis
export {
	getEmojiSequenceFromString,
	getUnqualifiedEmojiSequence,
} from './emoji/cleanup';
export {
	getEmojiCodePoint,
	splitUTF32Number,
	isUTF32SplitNumber,
	mergeUTF32Numbers,
	getEmojiUnicode,
	convertEmojiSequenceToUTF16,
	convertEmojiSequenceToUTF32,
} from './emoji/convert';
export {
	getEmojiUnicodeString,
	getEmojiSequenceString,
	getEmojiSequenceKeyword,
} from './emoji/format';
export { parseEmojiTestFile } from './emoji/test/parse';
export { getQualifiedEmojiVariations } from './emoji/test/variations';
export { findMissingEmojis } from './emoji/test/missing';
export {
	createOptimisedRegex,
	createOptimisedRegexForEmojiSequences,
} from './emoji/regex/create';
export {
	prepareEmojiForIconsList,
	prepareEmojiForIconSet,
} from './emoji/parse';
export { findAndReplaceEmojisInText } from './emoji/replace/replace';

// Misc
export { camelize, camelToKebab, snakelize, pascalize } from './misc/strings';
export {
	commonObjectProps,
	compareObjects,
	unmergeObjects,
} from './misc/objects';
