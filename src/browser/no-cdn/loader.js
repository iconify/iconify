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
 * Replacement for loader module when CDN is disabled
 */
(function(SimpleSVG) {
    "use strict";

    /**
     * Check if image exists in library
     *
     * @param {object} image Image object
     * @param {boolean} [checkQueue] True if queue should be checked. Default = true
     * @return {boolean}
     * @private
     */
    SimpleSVG._loadImage = SimpleSVG.iconExists;

})(self.SimpleSVG);
