/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
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
    config._imageClass = 'iconify';

    // Class name for image that is being loaded
    config._loadingClass = 'svg-loading';

    // Attribute that stores icon name
    config._iconAttribute = 'data-icon';

    // Attribute for rotation
    config._rotateAttribute = 'data-rotate';

    // Attribute for flip
    config._flipAttribute = 'data-flip';

    // Attribute for inline mode
    config._inlineModeAttribute = 'data-inline';

    // Attribute for alignment
    config._alignAttribute = 'data-align';

    // Attribute to append icon to element instead of replacing element
    config._appendAttribute = 'data-icon-append';

    // Class to add to container when content has been appended
    config._appendedClass = 'svg-appended';

    // Event to call when Iconify is ready
    config._readyEvent = 'IconifyReady';

    // Polyfill URLs
    config._webComponentsPolyfill = 'https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.24/webcomponents-lite.min.js';
    config._classListPolyfill = 'https://cdnjs.cloudflare.com/ajax/libs/classlist/1.1.20150312/classList.min.js';

})(local.config);
