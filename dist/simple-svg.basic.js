"use strict;"

self.SimpleSVG = {};


/**
 * Default configuration
 *
 * Additional defaults.js are included in sub-directories, with different content for different builds
 */
(function(SimpleSVG) {
    
    SimpleSVG._defaultConfig = {
        // Custom default attributes for SVG
        SVGAttributes: {
        },

        // Class name for icons
        imageClass: 'simple-svg',

        // Class name for image that is being loaded
        loadingClass: 'svg-loading',

        // Attribute that stores icon name
        iconAttribute: 'data-icon',

        // Tag for SVG placeholder
        placeholderTag: 'svg-placeholder',

        // Rotation and flip classes
        rotationClasses: {
            '1': 'svg-rotate-90',
            '2': 'svg-rotate-180',
            '3': 'svg-rotate-270'
        },
        hFlipClass: 'svg-flip-horizontal',
        vFlipClass: 'svg-flip-vertical'
    };

})(self.SimpleSVG);

/**
 * Merge custom and default configuration
 *
 * It will merge with existing SimpleSVG.config and SimpleSVGConfig objects, adding only items that aren't set
 */
(function(global, SimpleSVG) {
    
    var customConfig = SimpleSVG.config === void 0 ? null : SimpleSVG.config;

    function merge(list) {
        Object.keys(SimpleSVG.config).forEach(function(key) {
            if (list[key] === void 0) {
                return;
            }

            switch (key) {
                case 'customCDN':
                    // Merge objects
                    Object.keys(list[key]).forEach(function(key2) {
                        SimpleSVG.config[key][key2] = list[key][key2];
                    });
                    break;

                default:
                    // Overwrite config
                    SimpleSVG.config[key] = list[key];
            }
        });
    }

    SimpleSVG.config = SimpleSVG._defaultConfig;

    // Merge with SimpleSVGConfig object
    if (global.SimpleSVGConfig !== void 0 && typeof global.SimpleSVGConfig === 'object') {
        merge(global.SimpleSVGConfig);
    }

    // Merge with existing config object
    if (customConfig !== null) {
        merge(customConfig);
    }

})(self, self.SimpleSVG);

(function (SimpleSVG) {
	
	/**
	 * Default values for attributes
	 *
	 * @type {object}
	 */
	var itemDefaults = {
	    rotate: 0,
	    vFlip: false,
	    hFlip: false
	};
	
	/**
	 * List of attributes to check
	 *
	 * @type {[string]}
	 */
	var itemAttributes = ['body', 'rotate', 'vFlip', 'hFlip', 'width', 'height'];
	
	/**
	 * Normalize icon, return new object
	 *
	 * @param {object} item Item data
	 * @param {object} [defaults] Default values for missing attributes
	 * @return {object|null}
	 */
	function normalizeIcon(item, defaults) {
	    var error = false,
	        result = {};
	
	    itemAttributes.forEach(function(attr) {
	        if (error) {
	            return;
	        }
	        if (item[attr] === void 0) {
	            if (defaults[attr] === void 0) {
	                error = true;
	                return;
	            }
	            result[attr] = defaults[attr];
	        } else {
	            result[attr] = normalizeValue(attr, item[attr]);
	            if (result[attr] === null) {
	                error = true;
	            }
	        }
	    });
	    return error ? null : result;
	}
	
	/**
	 * Normalize alias, return new object
	 *
	 * @param {object} item Alias data
	 * @param {object} items List of available items
	 * @return {object|null}
	 */
	function normalizeAlias(item, items) {
	    var parent, result, error;
	
	    if (typeof item.parent !== 'string' || items[item.parent] === void 0) {
	        return null;
	    }
	
	    parent = items[item.parent];
	    result = {
	        parent: item.parent
	    };
	    error = false;
	
	    itemAttributes.forEach(function(attr) {
	        if (error) {
	            return;
	        }
	
	        if (item[attr] === void 0) {
	            result[attr] = parent[attr];
	        } else {
	            switch (attr) {
	                case 'rotate':
	                    result[attr] = mergeRotation(parent[attr], item[attr]);
	                    break;
	
	                case 'hFlip':
	                case 'vFlip':
	                    result[attr] = mergeFlip(parent[attr], item[attr]);
	                    break;
	
	                default:
	                    result[attr] = normalizeValue(attr, item[attr]);
	            }
	            if (result[attr] === null) {
	                error = true;
	            }
	        }
	    });
	    return error ? null : result;
	}
	
	/**
	 * Convert value to appropriate type
	 *
	 * @param {string} attr Attribute name
	 * @param {*} value Value
	 * @return {*}
	 */
	function normalizeValue(attr, value) {
	    switch (attr) {
	        case 'rotate':
	            value = parseInt(value);
	            if (isNaN(value)) {
	                return null;
	            }
	            while (value < 0) {
	                value += 4;
	            }
	            while (value > 3) {
	                value -= 4;
	            }
	            return value;
	
	        case 'width':
	        case 'height':
	            value = parseFloat(value);
	            return isNaN(value) ? null : value;
	
	        case 'vFlip':
	        case 'hFlip':
	            return !!value;
	
	        case 'body':
	            return typeof value === 'string' ? value : null;
	    }
	    return value;
	}
	
	/**
	 * Merge and normalize rotate values
	 *
	 * @param value1
	 * @param value2
	 * @return {*}
	 */
	function mergeRotation(value1, value2) {
	    return normalizeValue('rotate', value1 + value2);
	}
	
	/**
	 * Merge and normalize flip values
	 *
	 * @param value1
	 * @param value2
	 * @return {boolean}
	 */
	function mergeFlip(value1, value2) {
	    return (!!value1) !== (!!value2);
	}
	
	/**
	 * Returns new instance of storage object
	 *
	 * @return {object}
	 * @constructor
	 */
	function Storage() {
	    this.items = {};
	
	    /**
	     * Function to add library
	     *
	     * @param {object} json JSON data
	     * @return {number} Number of added items
	     */
	    this.addLibrary = function(json) {
	        // Get default values
	        var defaults = {},
	            items = this.items,
	            added = 0;
	
	        // Get default values for icons
	        itemAttributes.forEach(function(attr) {
	            if (json[attr] !== void 0) {
	                defaults[attr] = json[attr];
	            } else if (itemDefaults[attr] !== void 0) {
	                defaults[attr] = itemDefaults[attr];
	            }
	        });
	
	        // Parse icons
	        if (json.icons !== void 0) {
	            Object.keys(json.icons).forEach(function(key) {
	                var item = normalizeIcon(json.icons[key], defaults);
	                if (item !== null) {
	                    items[key] = item;
	                    added ++;
	                }
	            });
	        }
	
	        // Parse aliases
	        if (json.aliases !== void 0) {
	            Object.keys(json.aliases).forEach(function(key) {
	                var item = normalizeAlias(json.aliases[key], items);
	                if (item !== null) {
	                    items[key] = item;
	                    added ++;
	                }
	            });
	        }
	
	        return added;
	    };
	
	    /**
	     * Add icon
	     *
	     * @param {string} name Icon name
	     * @param {object} data Icon data
	     * @return {boolean} True if icon was added, false on error
	     */
	    this.addIcon = function(name, data) {
	        if (data.parent !== void 0) {
	            data = normalizeAlias(data, this.items);
	        } else {
	            data = normalizeIcon(data, itemDefaults);
	        }
	        return !!(this.items[name] = data);
	    };
	
	    /**
	     * Check if icon exists
	     *
	     * @param {string} name Icon name
	     * @return {boolean}
	     */
	    this.exists = function(name) {
	        return !!this.items[name];
	    };
	
	    /**
	     * Get list of available items
	     *
	     * @return {Array}
	     */
	    this.list = function() {
	        return Object.keys(this.items);
	    };
	
	    /**
	     * Get item data
	     *
	     * @param {string} name
	     * @param {boolean} [copy] True if object should be copied. Default = true
	     * @return {null}
	     */
	    this.get = function(name, copy) {
	        var result, item;
	
	        if (this.items[name] === void 0) {
	            return null;
	        }
	
	        if (copy === false) {
	            return this.items[name];
	        }
	
	        result = {};
	        item = this.items[name];
	
	        itemAttributes.forEach(function(key) {
	            result[key] = item[key];
	        });
	
	        return result;
	    };
	
	    return this;
	}
	
	// Export static functions used by SVG object
	Storage.mergeFlip = mergeFlip;
	Storage.mergeRotation = mergeRotation;
	
	SimpleSVG._Storage = Storage;
})(self.SimpleSVG);

/**
 * Replacement for observer module when observer is disabled
 */
(function(SimpleSVG) {
    
    var eventQueued = false,
        storage = new SimpleSVG._Storage();

    /**
     * Triggers callback
     */
    function triggerCallback() {
        if (!eventQueued) {
            return;
        }
        eventQueued = false;
        if (typeof SimpleSVG._onIconsAdded === 'function') {
            SimpleSVG._onIconsAdded();
        }
    }

    /**
     * Function to add library
     *
     * @param {object} json JSON data
     * @return {number} Number of added items
     */
    SimpleSVG.addLibrary = function(json) {
        var result = storage.addLibrary(json);
        if (result) {
            if (!eventQueued) {
                eventQueued = true;
                setTimeout(triggerCallback, 0);
            }
        }
    };

    /**
     * Add icon
     *
     * @param {string} name Icon name
     * @param {object} data Icon data
     * @return {boolean} True if icon was added, false on error
     */
    SimpleSVG.addIcon = function(name, data) {
        var result = storage.addIcon(name, data);
        if (result) {
            if (!eventQueued) {
                eventQueued = true;
                setTimeout(triggerCallback, 0);
            }
        }
        return result;
    };

    /**
     * Check if icon exists
     *
     * @param {string} name Icon name
     * @return {boolean}
     */
    SimpleSVG.iconExists = storage.exists.bind(storage);

    /**
     * Get icon data
     *
     * @param {string} name
     * @param {boolean} [copy] True if object should be copied. Default = true
     * @return {null}
     */
    SimpleSVG.getIcon = storage.get.bind(storage);

    /**
     * Get list of available icons
     *
     * @return {Array}
     */
    SimpleSVG.listIcons = storage.list.bind(storage);

})(self.SimpleSVG);

(function (SimpleSVG) {
	
	var Storage = SimpleSVG._Storage;
	
	/**
	 * Regular expressions for calculating dimensions
	 *
	 * @type {RegExp}
	 */
	var unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g,
	    unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
	
	/**
	 * List of default attributes
	 *
	 * @type {[string]}
	 */
	var defaultAttributes = ['xmlns', 'xmlns:xlink', 'preserveAspectRatio', 'viewBox'];
	
	/**
	 * Unique id counter
	 *
	 * @type {number}
	 */
	var idCounter = 0;
	
	/**
	 * Calculate custom width or height
	 *
	 * @param {object} item Default item data
	 * @param {object} data Custom properties
	 * @param {string} prop1 Property to calculate (width or height)
	 * @param {string} prop2 Second property
	 * @return {string|number|null}
	 */
	function calculateCustomDimension(item, data, prop1, prop2) {
	    // Custom value is set - return it
	    if (data[prop1] !== void 0 && data[prop1] !== false) {
	        return data[prop1];
	    }
	
	    // Both custom values aren't set or custom value matches default value - return default
	    if (data[prop2] === void 0 || data[prop2] === false || data[prop2] === item[prop2]) {
	        return item[prop1];
	    }
	
	    // One of custom values is set - calculate another value
	    return calculateDimension(data[prop2], item[prop1] / item[prop2], data.precision);
	}
	
	/**
	 * Calculate second dimension when only 1 dimension is set
	 *
	 * @param {string|number} size One dimension (such as width)
	 * @param {number} ratio Width/height ratio.
	 *      If size is width, ratio = height/width
	 *      If size is height, ratio = width/height
	 * @param {number} [precision] Floating number precision in result to minimize output. Default = 100
	 * @return {string|number|null} Another dimension, null on error
	 */
	function calculateDimension(size, ratio, precision) {
	    var split, number, results, code, isNumber, valid, num;
	
	    if (ratio === 1) {
	        return size;
	    }
	
	    precision = precision === void 0 ? 100 : precision;
	    if (typeof size === 'number') {
	        return Math.ceil(size * ratio * precision) / precision;
	    }
	
	    // split code into sets of strings and numbers
	    split = size.split(unitsSplit);
	    if (split === null || !split.length) {
	        return null;
	    }
	
	    results = [];
	    code = split.shift();
	    isNumber = unitsTest.test(code);
	    valid = false;
	
	    while (true) {
	        if (isNumber) {
	            num = parseFloat(code);
	            if (isNaN(num)) {
	                return null;
	            }
	            valid = true;
	            results.push(Math.ceil(num * ratio * precision) / precision);
	        } else {
	            results.push(code);
	        }
	
	        // next
	        code = split.shift();
	        if (code === void 0) {
	            return valid ? results.join('') : null;
	        }
	        isNumber = !isNumber;
	    }
	}
	
	/**
	 * Get transformation string
	 *
	 * @param {object} attr Attributes
	 * @return {string}
	 */
	function calculateTransformation(attr) {
	    var rotate = attr.rotate;
	
	    function rotation() {
	        while (rotate < 1) {
	            rotate += 4;
	        }
	        while (rotate > 4) {
	            rotate -= 4;
	        }
	        return 'rotate(' + (rotate * 90) + 'deg)';
	    }
	
	    if (attr.vFlip && attr.hFlip) {
	        rotate += 2;
	        return rotation();
	    }
	
	    if (attr.vFlip || attr.hFlip) {
	        return 'scale(' + (attr.hFlip ? '-' : '') + '1, ' + (attr.vFlip ? '-' : '') + '1)' + (rotate ? ' ' + rotation() : '');
	    }
	    return rotation();
	}
	
	function replaceIDs(body) {
	    var regex = /\sid="(\S+)"/gi,
	        ids = [],
	        match;
	
	    function strReplace(search, replace, subject) {
	        var pos = 0;
	
	        while ((pos = subject.indexOf(search, pos)) !== -1) {
	            subject = subject.slice(0, pos) + replace + subject.slice(pos + search.length);
	            pos += replace.length;
	        }
	
	        return subject;
	    }
	
	    // Find all IDs
	    while (match = regex.exec(body)) {
	        ids.push(match[1]);
	    }
	    if (!ids.length) {
	        return body;
	    }
	
	    // Replace with unique ids
	    ids.forEach(function(id) {
	        var newID = 'SimpleSVGId' + idCounter;
	        idCounter ++;
	        body = strReplace('="' + id + '"', '="' + newID + '"', body);
	        body = strReplace('="#' + id + '"', '="#' + newID + '"', body);
	        body = strReplace('(#' + id + ')', '(#' + newID + ')', body);
	    });
	
	    return body;
	}
	
	/**
	 * SVG object constructor
	 *
	 * @param {object} item Item from storage
	 * @return {SVG}
	 * @constructor
	 */
	function SVG(item) {
	    this.item = item;
	
	    /**
	     * Get icon height
	     *
	     * @param {string|number} [width] Width to calculate height for. If missing, default icon height will be returned.
	     * @param {number} [precision] Precision for calculating height. Result is rounded to 1/precision. Default = 100
	     * @return {number|null}
	     */
	    this.height = function(width, precision) {
	        return calculateCustomDimension(this.item, {
	            width: width,
	            precision: precision
	        }, 'height', 'width');
	    };
	
	    /**
	     * Get icon width
	     *
	     * @param {string|number} [height] Height to calculate width for. If missing, default icon width will be returned.
	     * @param {number} [precision] Precision for calculating width. Result is rounded to 1/precision. Default = 100
	     * @return {number|null}
	     */
	    this.width = function(height, precision) {
	        return calculateCustomDimension(this.item, {
	            height: height,
	            precision: precision
	        }, 'width', 'height');
	    };
	
	    /**
	     * Get transformation string for icon
	     *
	     * @param {object} [props] Custom properties to merge with icon properties
	     * @return {string|null}
	     */
	    this.transformation = function(props) {
	        var data;
	
	        if (props !== void 0) {
	            data = {
	                vFlip: props.vFlip === void 0 ? this.item.vFlip : Storage.mergeFlip(this.item.vFlip, props.vFlip),
	                hFlip: props.hFlip === void 0 ? this.item.hFlip : Storage.mergeFlip(this.item.hFlip, props.hFlip),
	                rotate: props.rotate === void 0 ? this.item.rotate : Storage.mergeRotation(this.item.rotate, props.rotate)
	            };
	        } else {
	            data = this.item;
	        }
	
	        return calculateTransformation(data);
	    };
	
	    /**
	     * Get default SVG attributes
	     *
	     * @return {object}
	     */
	    this.defaultAttributes = function() {
	        return {
	            xmlns: 'http://www.w3.org/2000/svg',
	            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
	            preserveAspectRatio: 'xMidYMid meet',
	            viewBox: '0 0 ' + this.item.width + ' ' + this.item.height
	        };
	    };
	
	    /**
	     * Get SVG object for output
	     *
	     * @param {object} [props] Custom properties
	     * @param {boolean} [placeholder] True if element is placeholder
	     * @return {object|null}
	     */
	    this.svgObject = function(props, placeholder) {
	        var attributes, transformation, width, height, customWidth, customHeight, body, regex;
	
	        props = props === void 0 ? {} : props;
	        placeholder = placeholder === true;
	
	        attributes = placeholder ? {} : this.defaultAttributes();
	        transformation = this.transformation(props);
	
	        customWidth = props['data-width'] === void 0 ? props.width : props['data-width'];
	        customHeight = props['data-height'] === void 0 ? props.height : props['data-height'];
	
	        if (customWidth === void 0 && customHeight === void 0) {
	            height = '1em';
	            width = this.width(height);
	        } else if (customWidth !== void 0 && customHeight !== void 0) {
	            width = customWidth;
	            height = customHeight;
	        } else if (customWidth !== void 0) {
	            width = customWidth;
	            height = width === null ? null : this.height(width);
	        } else {
	            height = customHeight;
	            width = height === null ? null : this.width(height);
	        }
	
	        // width = props.width !== void 0 ? props.width : (props.height !== void 0 ? this.width(props.height) : this.item.width);
	        // height = props.height !== void 0 ? props.height : (props.width !== void 0 ? this.height(props.width) : this.item.height);
	
	        if (width !== null) {
	            attributes.width = width === 'auto' ? this.item.width : width;
	        }
	        if (height !== null) {
	            attributes.height = height === 'auto' ? this.item.height : height;
	        }
	
	        // Style
	        if (!placeholder) {
	            attributes.style = '-ms-transform: ' + transformation + ';' +
	                ' -webkit-transform: ' + transformation + ';' +
	                ' transform: ' + transformation + ';' +
	                (props.style === void 0 ? '' : props.style);
	        }
	
	        // Copy custom properties
	        Object.keys(props).forEach(function(attr) {
	            if (props[attr] === null) {
	                return;
	            }
	            switch (attr) {
	                case 'rotate':
	                case 'vFlip':
	                case 'hFlip':
	                case 'body':
	                case 'width':
	                case 'height':
	                    return;
	
	                case 'style':
	                    if (placeholder) {
	                        break;
	                    }
	                    return;
	
	                case 'before':
	                case 'after':
	                    if (placeholder) {
	                        attributes['data-' + attr] = props[attr];
	                    }
	                    return;
	
	                case 'data-before':
	                case 'data-after':
	                    if (!placeholder) {
	                        props[attr.slice(5)] = props[attr];
	                        return;
	                    }
	            }
	            attributes[attr] = props[attr];
	        });
	
	        // Output
	        if (placeholder) {
	            return {
	                attributes: attributes
	            };
	        }
	
	        body = (typeof props.before === 'string' ? props.before : '') + this.item.body + (typeof props.after === 'string' ? props.after : '');
	        body = replaceIDs(body);
	
	        return {
	            attributes: attributes,
	            body: body
	        };
	    };
	
	    return this;
	}
	
	// Export static variables and functions
	SVG.defaultAttributes = defaultAttributes;
	
	SimpleSVG._SVG = SVG;
})(self.SimpleSVG);

/**
 * Functions that create image objects
 */
(function(SimpleSVG) {
    
    var iconAttribute = SimpleSVG.config.iconAttribute,
        loadingClass = SimpleSVG.config.loadingClass,
        imageClass = SimpleSVG.config.imageClass;

    /**
     * Create object for new image
     *
     * @param {Element} element DOM element
     * @param {string} icon Icon name
     * @param {function} parser Parser function
     * @return {{element: Element, icon: string, parser: function, loading: boolean}}
     * @private
     */
    SimpleSVG._newImage = function(element, icon, parser) {
        return {
            element: element,
            icon: icon,
            parser: parser,
            loading: element.classList.contains(loadingClass)
        };
    };

    /**
     * Create object for parsed image
     *
     * @param {Element} element DOM element
     * @param {string} icon Icon name
     * @param {boolean} [hidden] True if image is hidden
     * @return {{element: Element, icon: string, hidden: boolean}}
     * @private
     */
    SimpleSVG._parsedImage = function(element, icon, hidden) {
        return {
            element: element,
            icon: icon,
            hidden: hidden === true
        };
    };

    /**
     * Get image attributes to pass to SVG
     *
     * @param {object} image
     * @return {object}
     * @private
     */
    SimpleSVG._getImageAttributes = function(image) {
        var results = {},
            i, attr;

        if (!image.element.hasAttributes()) {
            return results;
        }

        // Copy all attributes, filter them
        for (i = 0; i < image.element.attributes.length; i++) {
            attr = image.element.attributes[i];
            if (attr.name !== iconAttribute) {
                results[attr.name] = attr.value;
            }
        }

        // Filter attributes
        if (image.parser && image.parser.filterAttributes !== void 0) {
            results = image.parser.filterAttributes(image, results);
        } else if (image.element.tagName === 'SVG') {
            SimpleSVG._SVG.defaultAttributes.forEach(function(attr) {
                delete results[attr];
            });
        }

        // Filter class names
        if (results['class'] !== void 0) {
            results['class'] = results['class'].split(' ').filter(function(item) {
                return item !== loadingClass && item !== imageClass;
            });

            if (image.parser && image.parser.filterClasses !== void 0) {
                results['class'] = image.parser.filterClasses(image, results['class']);
            }

            results['class'] = results['class'].join(' ');
        }

        return results;
    };

})(self.SimpleSVG);

/**
 * Functions that find images in DOM
 */
(function(SimpleSVG) {
    
    var imageClass = SimpleSVG.config.imageClass,
        loadingClass = SimpleSVG.config.loadingClass,
        hFlipClass = SimpleSVG.config.hFlipClass,
        vFlipClass = SimpleSVG.config.vFlipClass,
        iconAttribute = SimpleSVG.config.iconAttribute,
        placeholderTag = SimpleSVG.config.placeholderTag,
        newSelectorExtra = ':not(.' + loadingClass + ')',
        loadingSelectorExtra = '.' + loadingClass;

    /**
     * List of finders
     *
     * @type {object}
     */
    var finders = {
        ssvg: {
            selector: '.' + imageClass,
            selectorNew: '.' + imageClass + newSelectorExtra,
            selectorLoading: '.' + imageClass + loadingSelectorExtra,

            /**
             * Get icon name from element
             *
             * @param {Element} element
             * @return {string} Icon name, empty string if none
             */
            icon: function(element) {
                var result = element.getAttribute(iconAttribute);
                return typeof result === 'string' ? result : '';
            },

            /**
             * Filter class names list, removing any custom classes
             *
             * If function is missing in finder, classes will not be filtered
             *
             * @param {object} image
             * @param {Array|DOMTokenList} list
             * @return {Array}
             */
            // filterClasses: function(image, list) { return list ; }

            /**
             * Filter attributes, removing any attributes that should not be passed to SVG
             *
             * If function is missing in finder, attributes will not be filtered
             *
             * @param {object} image
             * @param {object} attributes
             * @return {object}
             */
            // filterAttributes: function(image, attributes) { return attributes; }
        }
    };

    /**
     * List of finder keys for faster iteration
     *
     * @type {Array}
     */
    var finderKeys = Object.keys(finders);

    /**
     * Add custom finder
     *
     * @param {string} name Finder name
     * @param {object} finder Finder data
     */
    SimpleSVG.addFinder = function(name, finder) {
        // Set missing properties
        if (finder.selectorNew === void 0) {
            finder.selectorNew = finder.selector + ':not(.' + loadingClass + ')';
        }
        if (finder.selectorLoading === void 0) {
            finder.selectorLoading = finder.selector + '.' + loadingClass;
        }

        ['icon', 'hFlip', 'vFlip'].forEach(function(key) {
            if (finder[key] === void 0) {
                finder[key] = finders.ssvg[key];
            }
        });

        if (finder.rotation === void 0) {
            if (finder.rotationClasses !== void 0) {
                finder.rotation = function(element) {
                    return finders.ssvg.rotation(element, finder.rotationClasses);
                };
            }
            finder.rotation = finders.ssvg.rotation;
        }

        finders[name] = finder;
        finderKeys = Object.keys(finders);
    };

    /**
     * Find new images
     *
     * @param {Element} root Root element
     * @param {boolean} [loading] Filter images by loading status. If missing, result will not be filtered
     * @return {Array}
     * @private
     */
    SimpleSVG._findNewImages = function(root, loading) {
        var results = [],
            duplicates = [];

        finderKeys.forEach(function(key) {
            var finder = finders[key],
                selector = loading === true ? finder.selectorLoading : (loading === false ? finder.selectorNew : finder.selector);

            var nodes = root.querySelectorAll(selector + ':not(svg):not(' + placeholderTag + ')'),
                index, node, icon;

            for (index = 0; index < nodes.length; index ++) {
                node = nodes[index];
                icon = finder.icon(node);

                if (icon && duplicates.indexOf(node) === -1) {
                    duplicates.push(node);
                    results.push(SimpleSVG._newImage(node, icon, finder));
                }
            }
        });

        return results;
    };

    /**
     * Find hidden or parsed images
     *
     * @param {Element} root Root element
     * @param {string} tag Element tag
     * @param {boolean} hidden Status
     * @return {Array}
     * @private
     */
    SimpleSVG._findHiddenOrParsedImages = function(root, tag, hidden) {
        var results = [];

        var nodes = root.querySelectorAll(tag + '.' + imageClass),
            index, node, icon;

        for (index = 0; index < nodes.length; index ++) {
            node = nodes[index];
            icon = node.getAttribute(iconAttribute);

            if (icon) {
                results.push(SimpleSVG._parsedImage(node, icon, hidden));
            }
        }

        return results;
    };

    /**
     * Find all hidden images (waiting to be displayed)
     *
     * @param {Element} root Root element
     * @return {Array}
     * @private
     */
    SimpleSVG._findHiddenImages = function(root) {
        return SimpleSVG._findHiddenOrParsedImages(root, placeholderTag, true);
    };

    /**
     * Find all parsed images
     *
     * @param {Element} root Root element
     * @return {Array}
     * @private
     */
    SimpleSVG._findParsedImages = function(root) {
        return SimpleSVG._findHiddenOrParsedImages(root, 'svg', false);
    };

})(self.SimpleSVG);

/**
 * Replacement for loader module when CDN is disabled
 */
(function(SimpleSVG) {
    
    /**
     * Check if image exists in library
     *
     * @param {object} image Image object
     * @param {boolean} [checkQueue] True if queue should be checked. Default = true
     * @return {boolean}
     * @private
     */
    SimpleSVG._loadImage = SimpleSVG.iconExists;

})(self.SimpleSVG);

/**
 * Replacement for lazy loader when lazy loader is disabled
 */
(function(SimpleSVG) {
    
    SimpleSVG._imageVisible = function(image) {
        return true;
    };

})(self.SimpleSVG);

/**
 * Replacement for observer module when observer is disabled
 */
(function(SimpleSVG) {
    
    SimpleSVG.pauseObserving = function() {};
    SimpleSVG.resumeObserving = function() {};

})(self.SimpleSVG);

/**
 * Module for changing images
 */
(function(SimpleSVG) {
    
    var placeholderTag = SimpleSVG.config.placeholderTag,
        iconAttribute = SimpleSVG.config.iconAttribute,
        loadingClass = SimpleSVG.config.loadingClass,
        imageClass = SimpleSVG.config.imageClass,
        hFlipClass = SimpleSVG.config.hFlipClass,
        vFlipClass = SimpleSVG.config.vFlipClass,
        rotationClasses = SimpleSVG.config.rotationClasses,
        transformationChanges = {},
        transformationClasses;

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
     * Render SVG or SVG placeholder
     *
     * @param {object} image
     * @param {boolean} [hidden]
     * @private
     */
    SimpleSVG._renderSVG = function(image, hidden) {
        var attributes = SimpleSVG._getImageAttributes(image),
            item = SimpleSVG.getIcon(image.icon),
            svg, el, el2, data, html, pos;

        hidden = hidden === true;

        attributes[iconAttribute] = image.icon;
        svg = new SimpleSVG._SVG(item, hidden);
        el = document.createElement(hidden ? placeholderTag : 'svg');

        // flip and rotate
        if (!hidden) {
            transformationClasses.forEach(function(key) {
                if (image.element.classList.contains(key)) {
                    attributes[transformationChanges[key].attr] = transformationChanges[key].value;
                }
            });
        }

        data = svg.svgObject(attributes, hidden);
        Object.keys(data.attributes).forEach(function(attr) {
            el.setAttribute(attr, data.attributes[attr]);
        });
        if (image.loading) {
            el.classList.remove(loadingClass);
        }
        el.classList.add(imageClass);

        if (!hidden) {
            // innerHTML is not supported for SVG element :(
            // Creating temporary element instead
            html = el.outerHTML;
            if (html.slice(0, 2) === '<?') {
                // XML prefix from old IE
                pos = html.indexOf('>');
                html = html.slice(pos + 1);
            }
            pos = html.indexOf('</');
            if (pos !== -1) {
                // Closing tag
                html = html.replace('</', data.body + '</');
            } else {
                // Self-closing
                html = html.replace('/>', '>' + data.body + '</svg>');
            }
            el = document.createElement('span');
            el.innerHTML = html;
        }

        image.element.parentNode.replaceChild(el, image.element);

        if (!hidden) {
            el2 = el.childNodes[0];
            el.parentNode.replaceChild(el2, el);
            image.element = el2;
        } else {
            image.element = el;
        }

        delete image.parser;
        delete image.loading;
        image.hidden = hidden;
    };

})(self.SimpleSVG);

/**
 * Main file
 */
(function(SimpleSVG, scope) {
    
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
