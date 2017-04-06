/**
 * This file is part of the simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

/**
 * Default configuration.
 * Configuration variables that cannot be changed after script has loaded start with _
 *
 * Additional defaults.js are included in sub-directories, with different content for different builds
 */
(function(config) {
    "use strict";

    // Custom default attributes for SVG
    config.SVGAttributes = {};

    // Class name for icons
    config._imageClass = 'simple-svg';

    // Class name for image that is being loaded
    config._loadingClass = 'svg-loading';

    // Attribute that stores icon name
    config._iconAttribute = 'data-icon';

    // Tag for SVG placeholder
    config._placeholderTag = 'svg-placeholder';

    // Rotation and flip classes
    config._rotationClasses = {
        '1': 'svg-rotate-90',
        '2': 'svg-rotate-180',
        '3': 'svg-rotate-270'
    };
    config._hFlipClass = 'svg-flip-horizontal';
    config._vFlipClass = 'svg-flip-vertical';

    // Event to call when SimpleSVG is ready
    config._readyEvent = 'SimpleSVGReady';

})(local.config);
