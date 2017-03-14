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
 * Default configuration when API is included
 */
(function(SimpleSVG, scope) {
    "use strict";

    var isAncientBrowser = !Object.assign || !scope.MutationObserver;

    // API callback script
    SimpleSVG._defaultConfig.api = (isAncientBrowser ? '' : 'https:') + '//www.artodia.com/ssvg/?callback={callback}&icons={icons}';

})(self.SimpleSVG, self);
