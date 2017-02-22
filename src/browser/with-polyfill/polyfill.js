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
 * Observer automatically loads polyfill for MutationObserver for IE9-10 from CDN that can be configured
 *
 * Observer should be paused before adding any new items using SimpleSVG.pauseObserving()
 * and resumed after that using SimpleSVG.resumeObserving()
 * Pause/resume can stack, so if you call pause twice, resume should be called twice.
 */
(function(SimpleSVG, scope) {
    "use strict";

    var poly = false;

    /**
     * Try to load polyfill
     *
     * @param {string} url
     */
    function loadPolyFill(url) {
        var timer, element;

        function check() {
            if (!scope.MutationObserver || !scope.WeakMap) {
                poly ++;
                // Check up to 50 times (25 seconds), then give up
                if (poly > 50) {
                    clearInterval(timer);
                }
            } else {
                clearInterval(timer);
                // Loaded!

                SimpleSVG._loadingPolyfill = false;
                if (SimpleSVG._onPolyfillLoaded !== void 0) {
                    SimpleSVG._onPolyfillLoaded();
                }
            }
        }

        element = document.createElement('script');
        element.setAttribute('src', url);
        element.setAttribute('type', 'text/javascript');
        element.setAttribute('async', true);
        poly = 1;

        document.head.appendChild(element);

        timer = setInterval(check, 500);
    }

    // Check if MutationObserver is available in browser
    // P.S. IE must die!
    SimpleSVG._loadingPolyfill = false;
    if ((!scope.MutationObserver || !scope.WeakMap) && SimpleSVG.config.polyfill) {
        // Try to load polyfill
        SimpleSVG._loadingPolyfill = true;
        loadPolyFill(SimpleSVG.config.polyfill);
    }

})(self.SimpleSVG, self);
