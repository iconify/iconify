/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */

/**
 * Check if DOM is ready, fire stuff when it is
 */
(function(Iconify, local, config) {
    "use strict";

    /**
     * Timer for initTimeout()
     *
     * @type {*}
     */
    var timer = null;

    /**
     * DOM is ready. Initialize stuff
     */
    local.DOMReadyCallback = function() {
        local.domready = true;
        local.nextInitItem();
    };

    /**
     * Remove event listeners and call DOMReady()
     */
    function DOMLoaded() {
        document.removeEventListener('DOMContentLoaded', DOMLoaded);
        window.removeEventListener('load', DOMLoaded);
        local.DOMReadyCallback();
    }

    /**
     * Function to create timer for init callback
     *
     * @param callback
     */
    local.initTimeout = function(callback) {
        function nextTick() {
            if (timer === null) {
                return;
            }
            if (timer.callback() !== false) {
                timer.stop();
                local.nextInitItem();
                return;
            }
            timer.counter ++;

            if (timer.counter === 10 || timer.counter === 25) {
                // Increase timer to reduce page load
                window.clearInterval(timer.id);
                timer.id = window.setInterval(nextTick, timer.counter === 10 ? 250 : 1000);
            }
        }

        if (timer !== null) {
            timer.stop();
        }

        timer = {
            id: window.setInterval(nextTick, 100),
            counter: 0,
            callback: callback,
            stop: function() {
                window.clearInterval(timer.id);
                timer = null;
            },
            nextTick: nextTick
        };
    };

    /**
     * State of DOM
     *
     * @type {boolean}
     */
    local.domready = false;

    /**
     * State of ready (DOM is ready, initialized)
     *
     * @type {boolean}
     */
    local.ready = false;

    /**
     * List of callbacks to call when Iconify is initializing
     * Callback should return boolean: true if its ready and next event should be called, false if not ready
     * If function returns false, it should call local.nextInitItem when its done
     *
     * @type {[Function]}
     */
    local.initQueue = [];

    /**
     * List of callbacks to call when DOM is ready and initialization has been finished
     * Callback should return boolean: true if its ready and next event should be called, false if not ready
     * If function returns false, it should call local.nextInitItem when its done
     *
     * @type {[Function]}
     */
    local.readyQueue = [];

    /**
     * Check init queue, do next step
     */
    local.nextInitItem = function() {
        var callback;

        if (local.ready) {
            return;
        }

        if (local.initQueue.length) {
            callback = local.initQueue.shift();
        } else {
            if (!local.domready) {
                // Init queue is done. Scan DOM on timer to refresh icons during load
                local.initTimeout(function() {
                    if (!local.domready && document.body) {
                        local.scanDOM();
                    }
                    return local.domready;
                });

                return;
            }

            if (local.readyQueue.length) {
                callback = local.readyQueue.shift();
            } else {
                local.ready = Iconify.isReady = true;
                local.event(config._readyEvent);
                local.scanDOM();
                return;
            }
        }

        if (callback() !== false) {
            local.nextInitItem();
        }
    };

    /**
     * Add stylesheet
     *
     * @param timed
     * @returns {boolean}
     */
    local.addStylesheet = function(timed) {
        var el;

        if (!document.head || !document.body) {
            if (local.domready) {
                // head or body is missing, but document is ready? weird
                return true;
            }
            if (!timed) {
                local.initTimeout(local.addStylesheet.bind(null, true));
            }
            return false;
        }

        // Add Iconify stylesheet
        el = document.createElement('style');
        el.type = 'text/css';
        el.innerHTML = 'span.iconify, i.iconify, iconify-icon { display: inline-block; width: 1em; }';
        if (document.head.firstChild !== null) {
            document.head.insertBefore(el, document.head.firstChild);
        } else {
            document.head.appendChild(el);
        }
        return true;
    };
    local.initQueue.push(local.addStylesheet.bind(null, false));

    /**
     * Events to run when Iconify is ready
     *
     * @param {function} callback
     */
    Iconify.ready = function(callback) {
        if (Iconify.isReady) {
            window.setTimeout(callback);
        } else {
            document.addEventListener(config._readyEvent, callback);
        }
    };

    // Do stuff on next tick after script has loaded
    window.setTimeout(function() {
        // Check for DOM ready state
        if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
            local.domready = true;
        } else {
            document.addEventListener('DOMContentLoaded', DOMLoaded);
            window.addEventListener('load', DOMLoaded);
        }
        local.nextInitItem();
    });

})(Iconify, local, local.config);
