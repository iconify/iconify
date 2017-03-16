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
 * Module for loading images from remote location
 */
(function(global, SimpleSVG) {
    "use strict";

    /**
     * List of images queued for loading
     *
     * @type {Array}
     */
    var queue = [],
        tested = [];

    /**
     * True if queue will be parsed on next tick
     *
     * @type {boolean}
     */
    var queued = false;

    function loadQueue() {
        var queues = {},
            URLLengths = {},
            limit = SimpleSVG.config.loaderMaxURLSize,
            prefixes = Object.keys(SimpleSVG.config.customCDN);

        /**
         * Send JSONP request by adding script tag to document
         *
         * @param {string} prefix
         * @param {Array} items
         */
        function addScript(prefix, items) {
            var url = prefix === '.' ? SimpleSVG.config.defaultCDN : SimpleSVG.config.customCDN[prefix],
                element;

            url = url.replace('{callback}', 'SimpleSVG._loaderCallback').replace('{icons}', items.join(','));

            // Create script
            element = document.createElement('script');
            element.setAttribute('type', 'text/javascript');
            element.setAttribute('src', url);
            element.setAttribute('async', true);
            document.head.appendChild(element);
        }

        /**
         * Calculate base length of URL
         *
         * @param {string} prefix
         * @return {number|null}
         */
        function baseLength(prefix) {
            var url = prefix === '.' ? SimpleSVG.config.defaultCDN : SimpleSVG.config.customCDN[prefix];
            return url.indexOf('{icons}') === -1 ? null : url.replace('{callback}', 'SimpleSVG._loaderCallback').replace('{icons}', '').length;
        }

        queue.forEach(function(icon) {
            var prefix = '';

            // Check for custom CDN
            prefixes.forEach(function(customPrefix) {
                if (icon.slice(0, customPrefix.length) === customPrefix) {
                    prefix = customPrefix;
                }
            });

            if (prefix === '') {
                prefix = '.';
            }

            // Check if queue for prefix exists
            if (queues[prefix] === void 0) {
                queues[prefix] = [];
                URLLengths[prefix] = baseLength(prefix);
                if (URLLengths[prefix] === null) {
                    // URL without list of icons - loads entire library
                    addScript(prefix, []);
                }
            }

            // Add icon to queue
            if (URLLengths[prefix] !== null) {
                URLLengths[prefix] += icon.length + 1;
                if (URLLengths[prefix] >= limit) {
                    addScript(prefix, queues[prefix]);
                    queues[prefix] = [];
                    URLLengths[prefix] = baseLength(prefix);
                }

                queues[prefix].push(icon);
            }
        });

        // Get remaining items
        Object.keys(queues).forEach(function(prefix) {
            if (URLLengths[prefix] !== null && queues[prefix].length) {
                addScript(prefix, queues[prefix]);
            }
        });

        // Mark icons as loaded
        tested = tested.concat(queue);
        queue = [];
        queued = false;
    }

    /**
     * Callback for JSONP
     *
     * @param {object} data
     * @constructor
     */
    SimpleSVG._loaderCallback = function(data) {
        if (typeof data === 'object') {
            SimpleSVG.addLibrary(data);
        }
    };

    /**
     * Add image to queue, return true if image has been loaded
     *
     * @param {object} image Image object
     * @param {boolean} [checkQueue] True if queue should be checked. Default = true
     * @return {boolean}
     * @private
     */
    SimpleSVG._loadImage = function(image, checkQueue) {
        if (SimpleSVG.iconExists(image.icon)) {
            return true;
        }

        if (checkQueue === false) {
            return false;
        }

        // Check queue
        if (queue.indexOf(image.icon) !== -1 || tested.indexOf(image.icon) !== -1) {
            return false;
        }

        // Add to queue
        queue.push(image.icon);
        if (!queued) {
            queued = true;
            setTimeout(loadQueue, 0);
        }

        // Mark as loading
        image.element.classList.add(SimpleSVG.config.loadingClass);
        return false;
    };

})(self, self.SimpleSVG);
