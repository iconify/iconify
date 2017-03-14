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
