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
 * Default configuration when lazy loading is enabled
 */
(function(config) {
    "use strict";

    // Enable lazy loading: true/false
    config.lazy = true;

    // True if loader should check parent element's visibility instead of SVG image
    config.lazyParent = true;

    // Time after scroll/resize event when lazy loading is tested.
    // Used to reduce calculations when scroll/resize is called too often
    config.lazyDelay = 250;

    // True if lazy loader should wait until scrolling has ended before loading images.
    config.lazyWaitEndOfScroll = true;

})(local.config);
