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
 * Main file
 */
(function(SimpleSVG, scope) {
    "use strict";

    var initialized = false;

    /**
     * Find new icons and change them
     */
    function findNewIcons() {
        var paused = false;

        SimpleSVG._findNewImages(SimpleSVG.config.rootElement === void 0 ? document.body : SimpleSVG.config.rootElement).forEach(function(image) {
            if (SimpleSVG._loadImage(image)) {
                if (!paused) {
                    paused = true;
                    SimpleSVG.pauseObserving();
                }

                SimpleSVG._renderSVG(image, !SimpleSVG._imageVisible(image));
            }
        });

        if (paused) {
            SimpleSVG.resumeObserving();
        }
    }

    /**
     * Callback when new icons were added to storage
     */
    function newIcons() {
        findNewIcons();
    }

    /**
     * Callback when DOM was changed
     */
    function scanDOM() {
        // Find new icons
        findNewIcons();

        // Check visibility of existing icons
        if (SimpleSVG._checkLazyLoader !== void 0) {
            SimpleSVG._checkLazyLoader();
        }
    }
    SimpleSVG._scanDOM = scanDOM;

    /**
     * Start script
     */
    function init() {
        if (initialized) {
            return;
        }
        initialized = true;

        // Setup events
        SimpleSVG._onIconsAdded = newIcons;
        SimpleSVG._onNodesAdded = scanDOM;
        // window.addEventListener('load', scanDOM);

        // Scan DOM
        scanDOM();
    }

    switch (document.readyState) {
        case 'loading':
            document.addEventListener('DOMContentLoaded', init);
            document.onreadystatechange = init;
            break;

        default:
            init();
    }

})(self.SimpleSVG, self);
