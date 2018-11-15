/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license-gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
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
