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
 * Plugin for FontAwesome icons
 */
(function(SimpleSVG) {
    "use strict";

    /**
     * List of FontAwesome class names that do not represent icons
     *
     * @type {[string]}
     */
    var faReserved = ['fa-lg', 'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x', 'fa-fw', 'fa-ul', 'fa-li', 'fa-border', 'fa-pull-left', 'fa-pull-right', 'fa-spin', 'fa-pulse', 'fa-rotate-90', 'fa-rotate-180', 'fa-rotate-270', 'fa-flip-horizontal', 'fa-flip-vertical', 'fa-stack', 'fa-stack-1x', 'fa-stack-2x', 'fa-inverse'],
        rotateAttribute = SimpleSVG.getConfig('_rotateAttribute'),
        flipAttribute = SimpleSVG.getConfig('_flipAttribute'),
        inlineAttribute = SimpleSVG.getConfig('_inlineModeAttribute');

    /**
     * Link to stylesheet
     *
     * @type {string}
     */
    var stylesheetCDN = '//code.simplesvg.com/css/fa.css';

    /**
     * True if stylesheet has been added
     *
     * @type {boolean}
     */
    var styleAdded = false;

    /**
     * Inserts short version of FontAwesome stylesheet into DOM
     */
    function insertStylesheet() {
        var element = document.createElement('link');

        styleAdded = true;

        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('type', 'text/css');
        element.setAttribute('href', SimpleSVG.secureURL(stylesheetCDN));
        document.head.appendChild(element);
    }

    /**
     * Add finder to list of finders
     */
    SimpleSVG.addFinder('fa', {
        selector: '.fa',

        /**
         * Get icon name from element
         *
         * @param {Element} element
         * @return {string}
         */
        icon: function(element) {
            var item;

            for (var i = 0; i < element.classList.length; i++) {
                item = element.classList[i];
                if (item.slice(0, 3) === 'fa-' && faReserved.indexOf(item) === -1) {
                    return item;
                }
            }

            return '';
        },

        /**
         * Filter class names list, removing any FontAwesome specific classes
         *
         * @param {object} image
         * @param {Array|DOMTokenList} list
         * @return {Array}
         */
        filterClasses: function(image, list) {
            var results = [],
                transform = {
                    rotate: 0,
                    hFlip: false,
                    vFlip: false
                };

            if (image.attributes === void 0) {
                image.attributes = {};
            }

            for (var i = 0; i < list.length; i++) {
                switch (list[i]) {
                    case 'fa-rotate-90':
                        transform.rotate = 1;
                        break;

                    case 'fa-rotate-180':
                        transform.rotate = 2;
                        break;

                    case 'fa-rotate-270':
                        transform.rotate = 3;
                        break;

                    case 'fa-flip-horizontal':
                        transform.hFlip = true;
                        break;

                    case 'fa-flip-vertical':
                        transform.vFlip = true;
                        break;

                    default:
                        results.push(list[i]);
                }
            }

            if (image.attributes[inlineAttribute] === void 0) {
                image.attributes[inlineAttribute] = true;
            }

            // Add transformation as attributes
            if (transform.rotate) {
                image.attributes[rotateAttribute] = transform.rotate;
            }
            if (transform.hFlip || transform.vFlip) {
                image.attributes[flipAttribute] = (transform.hFlip && transform.vFlip) ? 'horizontal vertical' : (
                    transform.hFlip ? 'horizontal' : 'vertical'
                );
            }

            // Insert short version of FontAwesome stylesheet into DOM
            if (!styleAdded) {
                insertStylesheet();
            }

            return results;
        }
    });

})(SimpleSVG);
