/**
 * This file is part of the @iconify/iconify package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */

/**
 * Plugin for PrestaShop icons
 */
(function(Iconify) {
    "use strict";

    /**
     * Config variables
     *
     * @type {string}
     */
    var inlineAttribute = Iconify.getConfig('_inlineModeAttribute');
    var appendAttribute = Iconify.getConfig('_appendAttribute');

    /**
     * Characters map, generated
     *
     * @type {object}
     */
    var map = {
        "21": "itunes",
        "22": "kik",
        "23": "krop",
        "24": "last",
        "25": "linkedin",
        "26": "linkedin-alt",
        "27": "livejournal",
        "28": "lovedsgn",
        "29": "meetup",
        "30": "gowalla",
        "31": "gowalla-alt",
        "32": "grooveshark",
        "33": "hacker-news",
        "34": "hi5",
        "35": "hype-machine",
        "36": "hyves",
        "37": "icq",
        "38": "identi",
        "39": "instapaper",
        "40": "orkut",
        "41": "dropbox",
        "42": "drupal",
        "43": "dzone",
        "44": "ebay",
        "45": "ember",
        "46": "etsy",
        "47": "evernote",
        "48": "facebook",
        "49": "facebook-alt",
        "50": "forrst",
        "51": "foursquare",
        "52": "friendfeed",
        "53": "friendster",
        "54": "gdgt",
        "55": "github",
        "56": "github-alt",
        "57": "goodreads",
        "58": "google",
        "59": "google-buzz",
        "60": "picasa",
        "61": "aim",
        "62": "arto",
        "63": "aws",
        "64": "baidu",
        "65": "basecamp",
        "66": "bebo",
        "67": "behance",
        "68": "bing",
        "69": "blip",
        "70": "creative-commons",
        "71": "dailybooth",
        "72": "delicious",
        "73": "designbump",
        "74": "designfloat",
        "75": "designmoo",
        "76": "deviantart",
        "77": "digg",
        "78": "digg-alt",
        "79": "diigo",
        "6a": "blogger",
        "6b": "bnter",
        "6c": "brightkite",
        "6d": "cinch",
        "6e": "cloudapp",
        "6f": "coroflot",
        "7a": "dribbble",
        "4a": "facebook-places",
        "4b": "facto",
        "4c": "feedburner",
        "4d": "flickr",
        "4e": "folkd",
        "4f": "formspring",
        "5a": "google-talk",
        "2a": "metacafe",
        "2b": "ming",
        "2c": "mister-wong",
        "2d": "mixx",
        "2e": "mixx-alt",
        "2f": "mobileme",
        "3a": "msn-messenger",
        "3b": "myspace",
        "3c": "myspace-alt",
        "3d": "newsvine",
        "3e": "official",
        "3f": "openid",
        "5b": "pandora",
        "5d": "path",
        "5e": "paypal",
        "5f": "photobucket",
        "7b": "picassa",
        "7c": "pinboard",
        "7d": "ping",
        "7e": "pingchat",
        "5c": "playstation",
        "e000": "plixi",
        "e001": "plurk",
        "e002": "podcast",
        "e003": "posterous",
        "e004": "qik",
        "e005": "quik",
        "e006": "quora",
        "e007": "rdio",
        "e008": "readernaut",
        "e009": "reddit",
        "e00a": "retweet",
        "e00b": "robo",
        "e00c": "rss",
        "e00d": "scribd",
        "e00e": "sharethis",
        "e00f": "simplenote",
        "e010": "skype",
        "e011": "slashdot",
        "e012": "slideshare",
        "e013": "smugmug",
        "e014": "soundcloud",
        "e015": "spotify",
        "e016": "squarespace",
        "e017": "squidoo",
        "e018": "steam",
        "e019": "stumbleupon",
        "e01a": "technorati",
        "e01b": "threewords",
        "e01c": "tribe",
        "e01d": "tripit",
        "e01e": "tumblr",
        "e01f": "twitter",
        "e020": "twitter-alt",
        "e021": "vcard",
        "e022": "viddler",
        "e023": "vimeo",
        "e024": "virb",
        "e025": "w3",
        "e026": "whatsapp",
        "e027": "wikipedia",
        "e028": "windows",
        "e029": "wists",
        "e02a": "wordpress",
        "e02b": "wordpress-alt",
        "e02c": "xing",
        "e02d": "yahoo",
        "e02e": "yahoo-buzz",
        "e02f": "yahoo-messenger",
        "e030": "yelp",
        "e031": "youtube",
        "e032": "youtube-alt",
        "e033": "zerply",
        "e034": "zootool",
        "e035": "zynga",
        "e036": "aim-alt",
        "e037": "amazon",
        "e038": "app-store",
        "e039": "apple",
        "e03a": "girl",
        "e03b": "girl-sad",
        "e03c": "girl-confused",
        "e03d": "bank-safe",
        "e03e": "shopping-cart",
        "e03f": "blaster",
        "e040": "helm",
        "e041": "boiled-egg",
        "e042": "boiled-egg-finger",
        "e043": "cart",
        "e044": "coin",
        "e045": "coins",
        "e046": "couple",
        "e047": "credit-card",
        "e048": "crown",
        "e049": "daft-punk",
        "e04a": "dollar-bill",
        "e04b": "dollars",
        "e04c": "music",
        "e04d": "headphones",
        "e04e": "headset",
        "e04f": "egg",
        "e050": "fried-egg",
        "e051": "euro-bill",
        "e052": "extinguisher",
        "e053": "fuck",
        "e054": "full-screen",
        "e055": "gamepad",
        "e056": "girl-2",
        "e057": "girl-angel",
        "e058": "girl-angry",
        "e059": "girl-big-smile",
        "e05a": "girl-cry",
        "e05b": "girl-flushed",
        "e05c": "girl-open-mouth",
        "e05d": "girl-sleep",
        "e05e": "girl-smile",
        "e05f": "girl-user",
        "e060": "guy",
        "e061": "guy-angel",
        "e062": "guy-angry",
        "e063": "guy-big-smile",
        "e064": "guy-confused",
        "e065": "guy-cry",
        "e066": "guy-flushed",
        "e067": "guy-happy",
        "e068": "guy-o-mouth",
        "e069": "girl-o-mouth",
        "e06a": "guy-open-mouth",
        "e06b": "guy-sad",
        "e06c": "guy-sleep",
        "e06d": "guy-smile",
        "e06e": "guy-user",
        "e06f": "guy-wrong",
        "e070": "hand",
        "e071": "hand-pointer-left",
        "e072": "hand-pointer-right",
        "e073": "hand-pointer-top",
        "e074": "mayo-hotdog",
        "e075": "hotdog",
        "e076": "hungry",
        "e077": "enlarge",
        "e078": "laptop",
        "e079": "mail",
        "e07a": "mail-back",
        "e07b": "mail-bill",
        "e07c": "mail-stamp",
        "e07d": "moon",
        "e07e": "music-score",
        "e07f": "open-padlock",
        "e080": "organisation",
        "e081": "padlock",
        "e082": "paper-tablet",
        "e083": "pdiddy",
        "e084": "people-team",
        "e085": "piggy-bank",
        "e086": "piggy-bank-coins",
        "e087": "power",
        "e088": "printer",
        "e089": "promo",
        "e08a": "puzzle",
        "e08b": "resize",
        "e08c": "road",
        "e08d": "rss-icon",
        "e08e": "safe",
        "e08f": "sale-tag",
        "e090": "save",
        "e091": "shield",
        "e092": "store",
        "e093": "sign",
        "e094": "sreenshot",
        "e095": "sun",
        "e096": "cart-supermarket",
        "e097": "tag",
        "e098": "token",
        "e099": "delete",
        "e09a": "user",
        "e09b": "wallet",
        "e09c": "watch",
        "e09d": "30-80",
        "e09e": "40-105",
        "e09f": "50-120",
        "e0a0": "60-140",
        "e0a1": "70-160",
        "e0a2": "95-200",
        "e0a3": "airplane",
        "e0a4": "any-solvent",
        "e0a5": "any-solvent-without-tetrachlorethylene",
        "e0a6": "attachment",
        "e0a7": "warning",
        "e0a8": "barrel",
        "e0a9": "bike",
        "e0aa": "triangle",
        "e0ab": "broken-link",
        "e0ac": "bubble",
        "e0ad": "prison-school-bus",
        "e0ae": "car",
        "e0af": "cocktail",
        "e0b0": "do-not-bleach",
        "e0b1": "do-not-dry",
        "e0b2": "do-not-iron",
        "e0b3": "do-not-wash",
        "e0b4": "do-not-wring",
        "e0b5": "double-arrow",
        "e0b6": "drip-dry",
        "e0b7": "drop",
        "e0b8": "dry",
        "e0b9": "dry-flat",
        "e0ba": "dry-in-the-shade",
        "e0bb": "dry-normal-hight-heat",
        "e0bc": "dry-normal-low-heat",
        "e0bd": "heat",
        "e0be": "dry-normal-no-heat",
        "e0bf": "eject",
        "e0c0": "switch",
        "e0c1": "film",
        "e0c2": "apps",
        "e0c3": "gun",
        "e0c4": "hand-wash",
        "e0c5": "disabled",
        "e0c6": "hang-to-dry",
        "e0c7": "hard-drive",
        "e0c8": "hourglass",
        "e0c9": "important",
        "e0ca": "iron-any-temp",
        "e0cb": "justice",
        "e0cc": "keyboard",
        "e0cd": "link",
        "e0ce": "branch",
        "e0cf": "liquor",
        "e0d0": "bus-london",
        "e0d1": "machine-wash",
        "e0d2": "machine-wash-gentle-or-delicate",
        "e0d3": "machine-wash-permanent-press",
        "e0d4": "wand",
        "e0d5": "magnifying-glass",
        "e0d6": "maximum-temp-110-230",
        "e0d7": "maximum-temp-150-300",
        "e0d8": "maximum-temp-200-390",
        "e0d9": "megaphone",
        "e0da": "man",
        "e0db": "mic",
        "e0dc": "mic-off",
        "e0dd": "next",
        "e0de": "non-chlorine-bleach-if-needed",
        "e0df": "penknife",
        "e0e0": "petroleum-solvent-steam",
        "e0e1": "phone",
        "e0e2": "piano",
        "e0e3": "pin",
        "e0e4": "filter",
        "e0e5": "plane",
        "e0e6": "previous",
        "e0e7": "quote",
        "e0e8": "retweet-1",
        "e0e9": "sound",
        "e0ea": "sound-down",
        "e0eb": "sound-level-one",
        "e0ec": "sound-level-two",
        "e0ed": "sound-plus",
        "e0ee": "stethoscope",
        "e0ef": "suitcase",
        "e0f0": "target",
        "e0f1": "ticket",
        "e0f2": "trophy",
        "e0f3": "tumble-dry",
        "e0f4": "ufo",
        "e0f5": "video-camera",
        "e0f6": "truck-1",
        "e0f7": "water-temperature-30",
        "e0f8": "water-temperature-40",
        "e0f9": "water-temperature-50",
        "e0fa": "water-temperature-60",
        "e0fb": "water-temperature-70",
        "e0fc": "water-temperature-95",
        "e0fd": "clothes-water",
        "e0fe": "woman",
        "e0ff": "zoom-in",
        "e100": "zoom-out",
        "e101": "anchor",
        "e102": "left",
        "e103": "right",
        "e104": "up",
        "e105": "down",
        "e106": "play",
        "e107": "forward",
        "e108": "rewind",
        "e109": "forbidden",
        "e10a": "stats",
        "e10b": "bar-code",
        "e10c": "lab",
        "e10d": "beer",
        "e10e": "bell",
        "e10f": "book-tag",
        "e110": "minus-circle-1",
        "e111": "plus-box",
        "e112": "minus-box",
        "e113": "plus",
        "e114": "minus",
        "e115": "arrow-right",
        "e116": "down-arrow-circle",
        "e117": "up-arrow-circle",
        "e118": "right-arrow-circle",
        "e119": "left-arrow-circle",
        "e11a": "contrast",
        "e11b": "align-justified",
        "e11c": "align-right",
        "e11d": "align-left",
        "e11e": "minus-circle",
        "e11f": "book",
        "e120": "label-hogwarts",
        "e121": "label",
        "e122": "leaf",
        "e123": "work-case",
        "e124": "bug",
        "e125": "building",
        "e126": "calendar",
        "e127": "calendar-grid",
        "e128": "align-centered",
        "e129": "camera",
        "e12a": "check-box-empty",
        "e12b": "check-box",
        "e12c": "radio-empty",
        "e12d": "radio",
        "e12e": "coffee",
        "e12f": "coffee-hot",
        "e130": "compass",
        "e131": "bull-right",
        "e132": "bull-left",
        "e133": "chat-alt",
        "e134": "chat",
        "e135": "code",
        "e136": "flag-corner",
        "e137": "flag-scout",
        "e138": "flag",
        "e139": "row-setting",
        "e13a": "copy",
        "e13b": "file",
        "e13c": "crop",
        "e13d": "iphone",
        "e13e": "ipad",
        "e13f": "mac",
        "e140": "random",
        "e141": "arrow-box",
        "e142": "scissors",
        "e143": "dashboard",
        "e144": "world",
        "e145": "download",
        "e146": "upload",
        "e147": "fire",
        "e148": "eye",
        "e149": "no-eye",
        "e14a": "folder",
        "e14b": "clock",
        "e14c": "mouse",
        "e14d": "backpack",
        "e14e": "ipod",
        "e14f": "iwatch",
        "e150": "battery",
        "e151": "battery-charge",
        "e152": "lightning",
        "e153": "image",
        "e154": "gift",
        "e155": "cutlery",
        "e156": "pen",
        "e157": "archive",
        "e158": "arrow-down",
        "e159": "arrow-left",
        "e15a": "arrow-up",
        "e15b": "asterisk",
        "e15c": "browser",
        "e15d": "check",
        "e15e": "cloud",
        "e15f": "download-from-cloud",
        "e160": "upload-to-cloud",
        "e161": "checked",
        "e162": "ambulance",
        "e163": "mailbox",
        "e164": "plus-circle",
        "e165": "truck",
        "e166": "girl-sad-hunappy",
        "e167": "spades-card",
        "e168": "diamonds-card",
        "e169": "clubs-card",
        "e16a": "hearts-card",
        "e16b": "pull",
        "e16c": "pant",
        "e16d": "data-board",
        "e16e": "board",
        "e16f": "shoe",
        "e170": "globe",
        "e171": "pin-map",
        "e172": "bonnet",
        "e173": "contact",
        "e174": "fish",
        "e175": "cookie",
        "e176": "pizza",
        "e177": "birthday",
        "e178": "pc",
        "e179": "ram",
        "e17a": "cpu",
        "e17b": "milkshake",
        "e17c": "tacos",
        "e17d": "burger",
        "e17e": "home",
        "e17f": "lego",
        "e180": "preston"
    };

    function changeAttributes(image) {
        if (image.attributes === void 0) {
            image.attributes = {};
        }

        if (image.attributes[inlineAttribute] === void 0) {
            image.attributes[inlineAttribute] = true;
        }
        if (image.append) {
            image.attributes[appendAttribute] = true;
        }
    }

    /**
     * Add finder to list of finders
     */
    Iconify.addFinder('ps-class', {
        selector: '.ps-icon',

        /**
         * Get icon name from element
         *
         * @param {Element} element
         * @return {string|object}
         */
        icon: function(element) {
            var match = 'ps-icon-';
            var item, name;

            for (var i = 0; i < element.classList.length; i++) {
                item = element.classList[i];
                if (item.slice(0, match.length) === match) {
                    name = 'ps-' + item.slice(match.length);
                    if (element.tagName.toUpperCase() === 'DIV') {
                        return {
                            icon: name,
                            append: true
                        }
                    }
                    return name;
                }
            }

            return '';
        },

        /**
         * Filter class names list, removing any PrestaShop specific classes
         *
         * @param {object} image
         * @param {Array|DOMTokenList} list
         * @return {Array}
         */
        filterClasses: function(image, list) {
            var results;

            results = list.filter(function(item) {
                return (image.append || item !== 'ps-icon') && item.slice(0, 8) !== 'ps-icon-';
            });

            changeAttributes(image);

            return results;
        },
    });

    /**
     * Add finder to list of finders
     */
    Iconify.addFinder('ps-attr', {
        selector: '[data-ps-icon]',

        /**
         * Get icon name from element
         *
         * @param {Element} element
         * @return {string|object}
         */
        icon: function(element) {
            var char = element.getAttribute('data-ps-icon'),
                code, name;

            code = char.charCodeAt(0).toString(16);
            if (map[code] === void 0) {
                return '';
            }

            name = 'ps-' + map[code];
            if (element.tagName.toUpperCase() === 'DIV') {
                return {
                    icon: name,
                    append: true
                }
            }
            return name;
        },

        /**
         * Extract icon name from attributes
         *
         * @param image
         * @param attributes
         * @return {*}
         */
        filterAttributes: function(image, attributes) {
            image.element.removeAttribute('data-ps-icon');
            delete attributes['data-ps-icon'];

            changeAttributes(image);

            return attributes;
        }
    });

})(Iconify);
