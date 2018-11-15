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
 * Function to fire custom event and IE9 polyfill
 */
(function(local) {
    "use strict";

    /**
     * CustomEvent polyfill for IE9
     * From https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
     */
    (function() {
        if (typeof window.CustomEvent === 'function') return false;

        function CustomEvent(event, params) {
            var evt;

            params = params || { bubbles: false, cancelable: false, detail: void 0 };
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();

    /**
     * Dispatch custom event
     *
     * @param {string} name Event name
     * @param {object} [params] Event parameters
     */
    local.event = function(name, params) {
        document.dispatchEvent(new CustomEvent(name, params));
    };

})(local);
