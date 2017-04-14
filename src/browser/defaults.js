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

    // Attribute for rotation
    config._rotateAttribute = 'data-rotate';

    // Attribute for flip
    config._flipAttribute = 'data-flip';

    // Attribute for inline mode
    config._inlineModeAttribute = 'data-icon-inline';

    // Attribute for alignment
    config._alignAttribute = 'data-align';

    // Event to call when SimpleSVG is ready
    config._readyEvent = 'SimpleSVGReady';

})(local.config);
