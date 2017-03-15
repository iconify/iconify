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
        var defaultQueue = [],
            customQueues = {},
            prefixes = Object.keys(SimpleSVG.config.customCDN);

        function addScript(url, items) {
            var element;

            url = url.replace('{callback}', 'SimpleSVG._loaderCallback').replace('{icons}', items.join(','));

            // Create script
            element = document.createElement('script');
            element.setAttribute('type', 'text/javascript');
            element.setAttribute('src', url);
            element.setAttribute('async', true);
            document.head.appendChild(element);
        }

        queue.forEach(function(icon) {
            var prefix = '';

            // Check for custom CDN
            prefixes.forEach(function(customPrefix) {
                if (icon.slice(0, customPrefix.length) === customPrefix) {
                    prefix = customPrefix;
                }
            });

            // Add to queue
            if (prefix === '') {
                defaultQueue.push(icon);
                if (defaultQueue.length >= SimpleSVG.config.loaderIconsLimit) {
                    addScript(SimpleSVG.config.defaultCDN, defaultQueue);
                    defaultQueue = [];
                }
            } else {
                if (customQueues[prefix] === void 0) {
                    customQueues[prefix] = [];
                }
                customQueues[prefix].push(icon);
                if (customQueues[prefix].length >= SimpleSVG.config.loaderIconsLimit) {
                    addScript(SimpleSVG.config.customCDN[prefix], customQueues[prefix]);
                    customQueues[prefix] = [];
                }
            }
        });

        // Add extra queues
        if (defaultQueue.length) {
            addScript(SimpleSVG.config.defaultCDN, defaultQueue);
        }
        prefixes.forEach(function(prefix) {
            if (customQueues[prefix] !== void 0 && customQueues[prefix].length) {
                addScript(SimpleSVG.config.customCDN[prefix], customQueues[prefix]);
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
