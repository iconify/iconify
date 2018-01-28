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
    local.scanDOM = function() {
        var paused = false;

        function scan() {
            local.findNewImages().forEach(function(image) {
                if (local.loadImage(image)) {
                    if (!paused) {
                        paused = true;
                        SimpleSVG.pauseObserving();
                    }

                    local.renderSVG(image);
                }
            });
        }

        if (local.ready) {
            scan();
        } else {
            // Use try-catch if DOM is not ready yet
            try {
                scan();
            } catch (err) {
            }
        }

        if (paused) {
            SimpleSVG.resumeObserving();
        }
    };

    /**
     * Export function to scan DOM
     */
    SimpleSVG.scanDOM = local.scanDOM;

    /**
     * Get version
     *
     * @return {string}
     */
    SimpleSVG.getVersion = function() {
        return local.version;
    };

})(SimpleSVG, local);
