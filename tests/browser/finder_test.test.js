(function() {
    "use strict";

    var expect = chai.expect,
        should = chai.should();

    function load(SimpleSVG) {
        /* Modules() */
    }

    describe('Testing image finder', function() {
        var SimpleSVG,
            containerID = 'finder-container',
            validIconsID = 'finder-basic',
            invalidIconsID = 'finder-invalid',
            containerRoot,
            validIconsRoot,
            invalidIconsRoot;

        before(function() {
            // Check if jQuery is present
            expect(typeof jQuery).to.be.equal('function', 'jQuery is missing');

            // Add dummy code
            jQuery('#debug').append('<div id="' + containerID + '">' +
                '<div id="' + validIconsID + '">' +
                    '<p>Few icons: <i class="simple-svg" data-icon="fa-bear" /> <i class="simple-svg" data-icon="fa-apple" /></p>' +
                    '<p>Few more icons: <i class="simple-svg" data-icon="fa-apple" /> <i class="simple-svg" data-icon="mdi-arrow-up" /></p>' +
                    '<p>Some pending icons: <i class="simple-svg svg-loading" data-icon="fa-login" /> <i class="simple-svg svg-loading" data-icon="mdi-home" /></p>' +
                    '<p>Some icons awaiting lazy loader: <svg-placeholder class="simple-svg" data-icon="icon-home" /> <svg-placeholder class="simple-svg" data-icon="mdi-close" /></p>' +
                    '<p>Some parsed icons: <svg class="simple-svg" data-icon="empty-icon"><g /></svg></p>' +
                '</div>' +
                '<div id="' + invalidIconsID + '">' +
                    '<div>Some invalid attributes:' +
                        '<p>New icon with empty icon attribute: <i class="simple-svg" data-icon="" /></p>' +
                        '<p>New icon with wrong class name: <i class="simple-svg2" data-icon="mdi-question" /></p>' +
                        '<p>Placeholder without icon name: <svg-placeholder class="simple-svg" /></p>' +
                        '<p>Placeholder without class name: <svg-placeholder data-icon="mdi-asterisk" /></p>' +
                        '<p>SVG without class name: <svg data-icon="fa-arrow-left"><g /></svg></p>' +
                        '<p>SVG without icon name: <svg class="simple-svg"><g /></svg></p>' +
                    '</div>' +
                    '<div>Bad mixes of attributes that might end up detected incorrectly:' +
                        '<p>Loading placeholder: <svg-placeholder class="simple-svg svg-loading" data-icon="pending-placeholder" /></p>' +
                        '<p>Loading SVG: <svg class="simple-svg svg-loading" data-icon="pending-svg"><g /></svg></p>' +
                    '</div>' +
                '</div>' +
            '</div>');

            containerRoot = document.getElementById(containerID);
            validIconsRoot = document.getElementById(validIconsID);
            invalidIconsRoot = document.getElementById(invalidIconsID);

            // Setup fake SimpleSVG instance
            SimpleSVG = {};

            // Load libraries
            load(SimpleSVG);

            expect(typeof SimpleSVG._findNewImages).to.be.equal('function');
            expect(typeof SimpleSVG._findHiddenImages).to.be.equal('function');
            expect(typeof SimpleSVG._findParsedImages).to.be.equal('function');
        });

        it('finding valid images', function() {
            var results;

            // Find new icons
            results = SimpleSVG._findNewImages(validIconsRoot, false);
            expect(results.length).to.be.equal(4, 'Wrong number of new images');
            expect(results.map(function(item) {
                return item.icon
            })).to.be.eql(['fa-bear', 'fa-apple', 'fa-apple', 'mdi-arrow-up']);

            // Find icons that are being loaded
            results = SimpleSVG._findNewImages(validIconsRoot, true);
            expect(results.length).to.be.equal(2, 'Wrong number of images awaiting loader');
            expect(results.map(function(item) {
                return item.icon
            })).to.be.eql(['fa-login', 'mdi-home']);

            // Find all icons that have not been parsed
            results = SimpleSVG._findNewImages(validIconsRoot);
            expect(results.length).to.be.equal(6, 'Wrong number of unparsed images');
            expect(results.map(function(item) {
                return item.icon
            })).to.be.eql(['fa-bear', 'fa-apple', 'fa-apple', 'mdi-arrow-up', 'fa-login', 'mdi-home']);

            // Find all icons awaiting lazy loader
            results = SimpleSVG._findHiddenImages(validIconsRoot);
            expect(results.length).to.be.equal(2, 'Wrong number of hidden images');
            expect(results.map(function(item) {
                return item.icon
            })).to.be.eql(['icon-home', 'mdi-close']);

            // Find all parsed icons
            results = SimpleSVG._findParsedImages(validIconsRoot);
            expect(results.length).to.be.equal(1, 'Wrong number of parsed images');
            expect(results.map(function(item) {
                return item.icon
            })).to.be.eql(['empty-icon']);
        });

        it('checking invalid images', function() {
            var results;

            // Find new icons
            results = SimpleSVG._findNewImages(invalidIconsRoot, false);
            expect(results.length).to.be.equal(0, 'Wrong number of new images');

            // Find icons that are being loaded
            results = SimpleSVG._findNewImages(invalidIconsRoot, true);
            expect(results.length).to.be.equal(0, 'Wrong number of images awaiting loader');

            // Find all icons that have not been parsed
            results = SimpleSVG._findNewImages(invalidIconsRoot);
            expect(results.length).to.be.equal(0, 'Wrong number of unparsed images');

            // Find all icons awaiting lazy loader
            results = SimpleSVG._findHiddenImages(invalidIconsRoot);
            expect(results.length).to.be.equal(1, 'Wrong number of hidden images');
            expect(results.map(function(item) {
                return item.icon
            })).to.be.eql(['pending-placeholder']);

            // Find all parsed icons
            results = SimpleSVG._findParsedImages(invalidIconsRoot);
            expect(results.length).to.be.equal(1, 'Wrong number of parsed images');
            expect(results.map(function(item) {
                return item.icon
            })).to.be.eql(['pending-svg']);
        });

        it('checking all images', function() {
            var results;

            // Find new icons
            results = SimpleSVG._findNewImages(containerRoot, false);
            expect(results.length).to.be.equal(4, 'Wrong number of new images');

            // Find icons that are being loaded
            results = SimpleSVG._findNewImages(containerRoot, true);
            expect(results.length).to.be.equal(2, 'Wrong number of images awaiting loader');

            // Find all icons that have not been parsed
            results = SimpleSVG._findNewImages(containerRoot);
            expect(results.length).to.be.equal(6, 'Wrong number of unparsed images');

            // Find all icons awaiting lazy loader
            results = SimpleSVG._findHiddenImages(containerRoot);
            expect(results.length).to.be.equal(3, 'Wrong number of hidden images');

            // Find all parsed icons
            results = SimpleSVG._findParsedImages(containerRoot);
            expect(results.length).to.be.equal(2, 'Wrong number of parsed images');
        });

        it('checking custom finder', function() {
            var SimpleSVG = {},
                containerID = 'custom-finder',
                containerRoot, faReserved, results;

            // Add dummy code
            jQuery('#debug').append('<div id="' + containerID + '">' +
                '<p>Few icons: <i class="simple-svg" data-icon="mdi-bear" /> <i class="fa fa-apple" /></p>' +
                '<p>Few more icons: <i class="simple-svg" data-icon="fa-star" /> <i class="fa fa-lg fa-bookmark fa-rotate-90" /></p>' +
                '<p>Some pending icons: <i class="simple-svg svg-loading" data-icon="mdi-login" /> <i class="fa svg-loading fa-rotate-180 fa-home" /></p>' +
                '<p>Placeholder with bad class name: <svg-placeholder class="fa fa-print simple-svg" data-icon="mdi-close" /></p>' +
                '<p>SVG with bad class name: <svg class="simple-svg fa fa-camera" data-icon="empty-icon"><g /></svg></p>' +
            '</div>');

            containerRoot = document.getElementById(containerID);

            // Setup fake SimpleSVG instance
            SimpleSVG = {};

            // Load libraries
            load(SimpleSVG);

            // Add FontAwesome finder
            faReserved = ['fa-lg', 'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x', 'fa-fw', 'fa-ul', 'fa-li', 'fa-border', 'fa-pull-left', 'fa-pull-right', 'fa-spin', 'fa-pulse', 'fa-rotate-90', 'fa-rotate-180', 'fa-rotate-270', 'fa-flip-horizontal', 'fa-flip-vertical', 'fa-stack', 'fa-stack-1x', 'fa-stack-2x', 'fa-inverse'];
            SimpleSVG.addFinder('fa', {
                selector: '.fa',
                icon: function(element) {
                    var item;

                    for (var i = 0; i < element.classList.length; i++) {
                        item = element.classList[i];
                        if (item.slice(0, 3) === 'fa-' && faReserved.indexOf(item) === -1) {
                            return item;
                        }
                    }

                    return '';
                }
            });

            // Find new icons
            results = SimpleSVG._findNewImages(containerRoot, false);
            expect(results.length).to.be.equal(4, 'Wrong number of new images');
            expect(results.map(function(item) {
                return item.icon
            }).sort()).to.be.eql(['mdi-bear', 'fa-star', 'fa-apple', 'fa-bookmark'].sort());

            // Find icons that are being loaded
            results = SimpleSVG._findNewImages(containerRoot, true);
            expect(results.length).to.be.equal(2, 'Wrong number of images awaiting loader');
            expect(results.map(function(item) {
                return item.icon
            }).sort()).to.be.eql(['mdi-login', 'fa-home'].sort());

            // Find all icons that have not been parsed
            results = SimpleSVG._findNewImages(containerRoot);
            expect(results.length).to.be.equal(6, 'Wrong number of unparsed images');
            expect(results.map(function(item) {
                return item.icon
            }).sort()).to.be.eql(['mdi-bear', 'fa-star', 'fa-apple', 'fa-bookmark', 'mdi-login', 'fa-home'].sort());

            // Find all icons awaiting lazy loader
            results = SimpleSVG._findHiddenImages(containerRoot);
            expect(results.length).to.be.equal(1, 'Wrong number of hidden images');
            expect(results.map(function(item) {
                return item.icon
            })).to.be.eql(['mdi-close']);

            // Find all parsed icons
            results = SimpleSVG._findParsedImages(containerRoot);
            expect(results.length).to.be.equal(1, 'Wrong number of parsed images');
            expect(results.map(function(item) {
                return item.icon
            })).to.be.eql(['empty-icon']);
        });
    });
})();
