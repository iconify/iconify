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
 * Replacement for observer module when observer is disabled
 */
(function(SimpleSVG) {
    "use strict";

    SimpleSVG.pauseObserving = function() {};
    SimpleSVG.resumeObserving = function() {};

})(self.SimpleSVG);
