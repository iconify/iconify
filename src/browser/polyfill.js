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
        loading = {
            observer: false,
            classList: false
        },
        timer;

    /**
     * Load script
     *
     * @param {string} url
     */
    function load(url) {
        var element;

        if (!url.length) {
            return;
        }

        element = document.createElement('script');
        element.setAttribute('src', url);
        element.setAttribute('type', 'text/javascript');
        element.setAttribute('async', true);

        document.head.appendChild(element);
    }

    /**
     * Check if polyfills have loaded
     */
    function check() {
        // Check if observer has loaded
        if (loading.observer && global.MutationObserver && global.WeakMap) {
            loading.observer = false;
        }

        // Check if classList has loaded
        if (loading.classList && ('classList' in document.createElement('div'))) {
            loading.classList = false;
        }

        // Done
        if (!loading.observer && !loading.classList) {
            clearInterval(timer);
            local.init();
            return;
        }

        // Increase counter
        polyCounter ++;
        if (polyCounter === 60) {
            // Polyfills didn't load after 30 seconds - increase timer to reduce page load
            clearInterval(timer);
            timer = setInterval(check, 5000);
        }
    }

    // Check if ClassList is available in browser
    // P.S. IE must die!
    if (!('classList' in document.createElement('div'))) {
        // Try to load polyfill
        loading.classList = true;
        load(config._classListPolyfill);
    }

    // Check if MutationObserver is available in browser
    // P.S. IE must die!
    if ((!global.MutationObserver || !global.WeakMap)) {
        // Try to load polyfill
        loading.observer = true;
        load(config._webComponentsPolyfill);
    }

    // Setup timer and callback to check polyfills
    if (loading.observer || loading.classList) {
        local.preInitQueue.push(function() {
            return !loading.observer && !loading.classList;
        });
        polyCounter = 1;
        timer = setInterval(check, 500);
    }

})(local, local.config, global);
