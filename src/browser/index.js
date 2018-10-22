/**
 * This file is part of the @iconify/iconify package.
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
(function(Iconify, local) {
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
                        Iconify.pauseObserving();
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
            Iconify.resumeObserving();
        }
    };

    /**
     * Export function to scan DOM
     */
    Iconify.scanDOM = local.scanDOM;

    /**
     * Get version
     *
     * @return {string}
     */
    Iconify.getVersion = function() {
        return local.version;
    };

})(Iconify, local);
