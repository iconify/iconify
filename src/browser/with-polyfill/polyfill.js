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
 * Observer polyfill loader
 */
(function(local, config, global) {
    "use strict";

    var polyCounter = false,
        polyLoaded = true;

    /**
     * Try to load polyfill
     *
     * @param {string} url
     */
    function loadPolyFill(url) {
        var timer, element;

        function check() {
            if (!global.MutationObserver || !global.WeakMap) {
                polyCounter ++;
                // Check up to 50 times (25 seconds), then give up
                if (polyCounter > 50) {
                    clearInterval(timer);
                }
            } else {
                clearInterval(timer);
                // Loaded!

                polyLoaded = true;
                local.init();
            }
        }

        element = document.createElement('script');
        element.setAttribute('src', url);
        element.setAttribute('type', 'text/javascript');
        element.setAttribute('async', true);
        polyCounter = 1;

        document.head.appendChild(element);

        timer = setInterval(check, 500);
    }

    // Check if MutationObserver is available in browser
    // P.S. IE must die!
    if ((!global.MutationObserver || !global.WeakMap) && config._polyfill) {
        // Try to load polyfill
        polyLoaded = false;
        local.preInitQueue.push(function() {
            return polyLoaded;
        });
        loadPolyFill(config._polyfill);
    }

})(local, local.config, global);
