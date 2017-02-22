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
 * Default configuration when API is included
 */
(function(SimpleSVG, scope) {
    "use strict";

    var isAncientBrowser = !Object.assign || !scope.MutationObserver;

    // API callback script
    SimpleSVG._defaultConfig.api = (isAncientBrowser ? '' : 'https:') + '//www.artodia.com/ssvg/?callback={callback}&icons={icons}';

})(self.SimpleSVG, self);
