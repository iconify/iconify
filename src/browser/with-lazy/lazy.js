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
 * Replacement for lazy loader when lazy loader is disabled
 */
(function(SimpleSVG) {
    "use strict";

    /**
     * TODO!
     *
     * @param image
     * @return {boolean}
     * @private
     */
    SimpleSVG._imageVisible = function(image) {
        return true;
    };

})(self.SimpleSVG);
