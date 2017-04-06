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
 * Check if DOM is ready, fire stuff when it is
 */
(function(SimpleSVG, local, config) {
    "use strict";

    var loaded = false,
        initialized = false;

    /**
     * DOM is ready. Initialize stuff
     */
    function DOMReady() {
        loaded = true;
        local.init();
    }

    /**
     * Remove event listeners and call DOMReady()
     */
    function DOMLoaded() {
        document.removeEventListener('DOMContentLoaded', DOMLoaded);
        window.removeEventListener('load', DOMLoaded);
        DOMReady();
    }

    /**
     * List of callbacks to call to test if script is ready
     * Callback should return false if not ready, true if ready
     *
     * @type {[function]}
     */
    local.preInitQueue = [function() {
        return loaded;
    }];

    /**
     * List of callbacks to call when SimpleSVG is ready
     *
     * @type {[function]}
     */
    local.initQueue = [];

    /**
     * Initialize SimpleSVG
     */
    local.init = function() {
        if (initialized) {
            return;
        }

        // Filter all callbacks, keeping only those that return false
        local.preInitQueue = local.preInitQueue.filter(function(callback) {
            return !callback();
        });

        // Callbacks queue is empty - script is ready to be initialized
        if (!local.preInitQueue.length) {
            initialized = true;
            window.setTimeout(function() {
                SimpleSVG.isReady = true;
                local.initQueue.forEach(function(callback) {
                    callback();
                });
                local.event(config._readyEvent);
            });
        }
    };

    /**
     * Events to run when SimpleSVG is ready
     *
     * @param {function} callback
     */
    SimpleSVG.ready = function(callback) {
        if (SimpleSVG.isReady) {
            window.setTimeout(callback);
        } else {
            document.addEventListener(config._readyEvent, callback);
        }
    };

    // Do stuff on next tick after script has loaded
    window.setTimeout(function() {
        if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
            DOMReady();
        } else {
            document.addEventListener('DOMContentLoaded', DOMLoaded);
            window.addEventListener('load', DOMLoaded);
        }
    });

})(SimpleSVG, local, local.config);
