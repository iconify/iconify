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
(function(SimpleSVG, local) {
    "use strict";

    /**
     * Find new icons and change them
     */
    function findNewIcons() {
        var paused = false;

        if (!SimpleSVG.isReady) {
            return;
        }

        local.findNewImages().forEach(function(image) {
            if (local.loadImage(image)) {
                if (!paused) {
                    paused = true;
                    SimpleSVG.pauseObserving();
                }

                local.renderSVG(image);
            }
        });

        if (paused) {
            SimpleSVG.resumeObserving();
        }
    }

    /**
     * Callback when DOM was changed
     */
    function scanDOM() {
        if (!SimpleSVG.isReady) {
            return;
        }

        // Find new icons
        findNewIcons();
    }

    /**
     * Set local functions
     */
    local.iconsAdded = findNewIcons;
    local.nodesAdded = scanDOM;

    /**
     * Scan DOM when script is ready
     */
    local.initQueue.push(scanDOM);

    /**
     * Export function to scan DOM
     */
    SimpleSVG.scanDOM = scanDOM;

})(SimpleSVG, local);
