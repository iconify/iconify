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
 * Module for changing images
 */
(function(SimpleSVG, local, config) {
    "use strict";

    var iconAttribute = config._iconAttribute,
        loadingClass = config._loadingClass,
        imageClass = config._imageClass,
        hFlipClass = config._hFlipClass,
        vFlipClass = config._vFlipClass,
        rotationClasses = config._rotationClasses,
        transformationChanges = {},
        transformationClasses;

    /**
     * Generate SVG code
     *
     * @param {string} html Empty SVG element with all attributes
     * @param {string} body Body
     * @return {string}
     */
    function generateSVG(html, body) {
        var pos;

        if (html.slice(0, 2) === '<?') {
            // XML prefix from old IE
            pos = html.indexOf('>');
            html = html.slice(pos + 1);
        }

        // Fix lower case attributes
        html = html.replace('viewbox=', 'viewBox=').replace('preserveaspectratio=', 'preserveAspectRatio=');

        // Add body
        pos = html.indexOf('</');
        if (pos !== -1) {
            // Closing tag
            html = html.replace('</', body + '</');
        } else {
            // Self-closing
            html = html.replace('/>', '>' + body + '</svg>');
        }

        return html;
    }

    // Add transformations
    transformationChanges[hFlipClass] = {
        attr: 'hFlip',
        value: true
    };

    transformationChanges[vFlipClass] = {
        attr: 'vFlip',
        value: true
    };

    [1, 2, 3].forEach(function(key) {
        transformationChanges[rotationClasses[key]] = {
            attr: 'rotate',
            value: key
        };
    });

    transformationClasses = Object.keys(transformationChanges);

    /**
     * Render SVG
     *
     * @param {object} image
     */
    local.renderSVG = function(image) {
        var attributes = local.getImageAttributes(image),
            item = SimpleSVG.getIcon(image.icon),
            svg, el, el2, data, html;

        attributes[iconAttribute] = image.icon;
        svg = new local.SVG(item);
        el = document.createElement('svg');

        // flip and rotate
        transformationClasses.forEach(function(key) {
            if (image.element.classList.contains(key)) {
                attributes[transformationChanges[key].attr] = transformationChanges[key].value;
            }
        });

        data = svg.svgObject(attributes);
        Object.keys(data.attributes).forEach(function(attr) {
            el.setAttribute(attr, data.attributes[attr]);
        });
        if (image.loading) {
            el.classList.remove(loadingClass);
        }
        el.classList.add(imageClass);

        // innerHTML is not supported for SVG element :(
        // Creating temporary element instead
        html = generateSVG(el.outerHTML, data.body);

        el = document.createElement('span');
        el.innerHTML = html;

        image.element.parentNode.replaceChild(el, image.element);

        el2 = el.childNodes[0];
        el.parentNode.replaceChild(el2, el);
        image.element = el2;

        delete image.parser;
        delete image.loading;
    };

    /**
     * Get SVG icon code
     *
     * @param {string} name Icon name
     * @param {object} [properties] Custom properties
     * @return {string|false}
     */
    SimpleSVG.getSVG = function(name, properties) {
        var svg, el, data;

        if (!SimpleSVG.iconExists(name)) {
            return false;
        }

        svg = new local.SVG(SimpleSVG.getIcon(name));
        data = svg.svgObject(properties, false);

        el = document.createElement('svg');
        Object.keys(data.attributes).forEach(function(attr) {
            el.setAttribute(attr, data.attributes[attr]);
        });

        return generateSVG(el.outerHTML, data.body);
    };

})(SimpleSVG, local, local.config);
