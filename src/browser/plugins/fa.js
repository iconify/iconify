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
 * Plugin for FontAwesome icons
 */
(function(Iconify) {
    "use strict";

    /**
     * List of FontAwesome class names that do not represent icons
     *
     * @type {[string]}
     */
    var faReserved = ['fa-lg', 'fa-fw', 'fa-ul', 'fa-li', 'fa-border', 'fa-pull-left', 'fa-pull-right', 'fa-spin', 'fa-pulse', 'fa-rotate-90', 'fa-rotate-180', 'fa-rotate-270', 'fa-flip-horizontal', 'fa-flip-vertical', 'fa-stack', 'fa-stack-1x', 'fa-stack-2x', 'fa-inverse'],
        rotateAttribute = Iconify.getConfig('_rotateAttribute'),
        flipAttribute = Iconify.getConfig('_flipAttribute'),
        inlineAttribute = Iconify.getConfig('_inlineModeAttribute'),
        i;

    /**
     * Link to stylesheet
     *
     * @type {string}
     */
    var stylesheetCDN = '//code.iconify.design/css/fa.css';

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
        element.setAttribute('href', stylesheetCDN);
        document.head.appendChild(element);
    }

    /**
     * Create finder object
     *
     * @param {string} selector
     * @param {string} prefix
     * @returns {object}
     */
    function finder(selector, prefix) {
        return {
            selector: selector,

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
                        return prefix + ':' + item.slice(3);
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
        };
    }

    /**
     * Add more reserved keywords
     */
    for (i = 2; i < 11; i ++) {
        faReserved.push('fa-' + i + 'x');
    }

    /**
     * Add finder to list of finders
     */
    Iconify.addFinder('fa', finder('.fa', 'fa'));
    Iconify.addFinder('fas', finder('.fas', 'fa-solid'));
    Iconify.addFinder('far', finder('.far', 'fa-regular'));
    Iconify.addFinder('fal', finder('.fal', 'fa-light')); // pro only
    Iconify.addFinder('fab', finder('.fab', 'fa-brands'));

})(Iconify);
