/**
 * This file is part of the @cyberalien/simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * This is not open source library.
 * This library can be used only with products available on artodia.com
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Replacement for loader module when API is disabled
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
