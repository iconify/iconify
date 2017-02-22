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
 * Observer function
 *
 * This function waits for new nodes to be added to DOM, then calls
 * private function SimpleSVG._onNodesAdded(nodes)
 *
 * Callback argument "nodes" is not checked for duplicate nodes and list could be incorrect when using IE
 *
 * Observer should be paused before adding any new items using SimpleSVG.pauseObserving()
 * and resumed after that using SimpleSVG.resumeObserving()
 * Pause/resume can stack, so if you call pause twice, resume should be called twice.
 */
(function(SimpleSVG, scope) {
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
     * Setup dummy functions that replace observer
     */
    function setupDummy() {
        SimpleSVG.pauseObserving = function() {};
        SimpleSVG.resumeObserving = function() {};
    }

    /**
     * Trigger callback function
     *
     * @param {Array} nodes List of added nodes
     */
    function triggerEvent(nodes) {
        if (typeof SimpleSVG._onNodesAdded === 'function') {
            SimpleSVG._onNodesAdded(nodes);
        }
    }

    /**
     * Process all pending mutations
     */
    function processPendingMutations() {
        var temp = addedNodes;

        addedNodes = false;
        if (temp !== false && temp.length) {
            // At least 1 node was added
            triggerEvent(temp);
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
                setTimeout(processPendingMutations, 0);
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
        observer.observe(SimpleSVG.config.rootElement === void 0 ? document.body : SimpleSVG.config.rootElement, params);
    }

    /**
     * Create observer instance and start observing
     */
    function init() {
        observer = new scope.MutationObserver(processMutations);
        observe();
    }

    /**
     * Queue polyfill callback
     */
    function queuePolyfill() {
        var oldCallback = SimpleSVG._onPolyfillLoaded;

        SimpleSVG._onPolyfillLoaded = function() {
            // Init observer and scan
            init(true);
            triggerEvent([]);

            // Call previous callback
            if (oldCallback !== void 0) {
                oldCallback();
            }
        };
    }

    /**
     * Function to pause observing
     *
     * Multiple pauseObserving() calls stack, resuming observer only when same amount of resumeObserving() is called
     */
    SimpleSVG.pauseObserving = function() {
        if (observer === null) {
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
        var temp;

        if (observer === null || !paused) {
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

    if (SimpleSVG._loadingPolyfill) {
        queuePolyfill();
    } else {
        init();
    }

})(self.SimpleSVG, self);
