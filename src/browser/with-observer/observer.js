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
 * Observer function
 *
 * Observer automatically loads polyfill for MutationObserver for IE9-10 from CDN that can be configured
 * See ../polyfill.js
 *
 * Observer can be paused using SimpleSVG.pauseObserving()
 * and resumed using SimpleSVG.resumeObserving()
 * Pause/resume can stack, so if you call pause twice, resume should be called twice.
 */
(function(SimpleSVG, local, config, global) {
    "use strict";

    var observer = null,
        paused = 0,
        queue = null,
        addedNodes = false,
        params = {
            childList: true,
            subtree: true
        };

    /**
     * Process all pending mutations
     */
    function processPendingMutations() {
        var temp;

        if (addedNodes !== false && addedNodes.length) {
            temp = addedNodes;
            addedNodes = false;
            local.scanDOM(temp);
        } else {
            addedNodes = false;
        }
    }

    /**
     * Process array of mutations
     *
     * @param mutations
     */
    function processMutations(mutations) {
        mutations.forEach(function(mutation) {
            var i;

            // Parse on next tick to collect all mutations
            if (addedNodes === false) {
                addedNodes = [];
                window.setTimeout(processPendingMutations, 0);
            }
            if (mutation.addedNodes) {
                for (i = 0; i < mutation.addedNodes.length; i++) {
                    addedNodes.push(mutation.addedNodes[i]);
                }
            }
        });
    }

    /**
     * Start/resume observing
     */
    function observe() {
        observer.observe(config._root === void 0 ? document.querySelector('body') : config._root, params);
    }

    /**
     * Function to pause observing
     *
     * Multiple pauseObserving() calls stack, resuming observer only when same amount of resumeObserving() is called
     */
    SimpleSVG.pauseObserving = function() {
        if (observer === null) {
            paused ++;
            return;
        }

        if (!paused) {
            // Store pending records, stop observer
            queue = observer.takeRecords();
            observer.disconnect();
        }
        paused ++;
    };

    /**
     * Function to resume observing
     */
    SimpleSVG.resumeObserving = function() {
        if (observer === null) {
            paused --;
            return;
        }
        if (!paused) {
            return;
        }

        paused --;
        if (!paused) {
            // Resume observer and process stored records
            observe();
            if (queue !== null && queue.length) {
                processMutations(queue);
            }
        }
    };

    /**
     * Check if observer is paused
     *
     * @returns {boolean}
     */
    SimpleSVG.isObserverPaused = function() {
        return observer === null || !!paused;
    };

    /**
     * Start observing when all modules and DOM are ready
     */
    local.readyQueue.push(function () {
        observer = new global.MutationObserver(processMutations);
        if (!paused) {
            observe();
        }
        return true;
    });

})(SimpleSVG, local, local.config, global);
