(function() {
    "use strict";

    var expect = chai.expect,
        should = chai.should();

    function load(SimpleSVG) {
        /* Modules() */
    }

    describe('Testing renderer', function() {
        it('rendering svg images', function(done) {
            var SimpleSVG = {},
                containerID = 'renderer-svg',
                containerRoot,
                pending = 0;

            function init() {
                // Add dummy code
                jQuery('#debug2').append('<div id="' + containerID + '">' +
                        '<i class="simple-svg" data-icon="fa-home" />' +
                        '<i class="simple-svg svg-flip-horizontal" data-icon="fa-arrow-left" height="20px" />' +
                    '</div>');

                containerRoot = document.getElementById(containerID);

                // Setup fake SimpleSVG instance
                SimpleSVG = {
                    _onIconsAdded: renderImages
                };

                // Load libraries
                load(SimpleSVG);
                SimpleSVG.config.api = SimpleSVG.config.api.replace('{callback}', 'window.SSVGRenderTest');
                window.SSVGRenderTest = SimpleSVG._loaderCallback;

                // Load images, start tests when images are available
                SimpleSVG._findNewImages(containerRoot).forEach(function(image) {
                    if (!SimpleSVG._loadImage(image)) {
                        pending ++;
                    } else {
                        SimpleSVG._renderSVG(image);
                    }
                });
                if (!pending) {
                    test();
                }
            }

            // Callback to load pending images
            function renderImages() {
                SimpleSVG._findNewImages(containerRoot).forEach(function(image) {
                    SimpleSVG._renderSVG(image);
                });
                test();
            }

            // Do test
            function test() {
                var image1 = containerRoot.childNodes[0],
                    image2 = containerRoot.childNodes[1];

                expect(image1.tagName.toLowerCase()).to.be.equal('svg', 'First image supposed to be SVG');
                expect(image2.tagName.toLowerCase()).to.be.equal('svg', 'Second image supposed to be SVG');

                expect(image1.getAttribute('class')).to.be.equal('simple-svg', 'Class name should be simple-svg');
                expect(image1.getAttribute('data-icon')).to.be.equal('fa-home', 'data-icon attribute is missing or invalid');
                expect(image1.getAttribute('style').indexOf('rotate(360deg)')).to.not.be.equal(-1, 'Style should contain 360deg rotation');
                expect(image1.hasAttribute('xmlns')).to.be.equal(true, 'xmlns is missing');

                expect(image2.getAttribute('style').indexOf('scale(-1, 1)')).to.not.be.equal(-1, 'Style should contain scale rotation');

                done();
            }

            init();
        });

        it('rendering placeholder', function(done) {
            var SimpleSVG = {},
                containerID = 'renderer-placeholder',
                containerRoot,
                pending = 0;

            function init() {
                // Add dummy code
                jQuery('#debug2').append('<div id="' + containerID + '">' +
                    '<i class="simple-svg" data-icon="fa-home" />' +
                    '<i class="simple-svg svg-rotate-90" data-icon="fa-arrow-left" height="20px" />' +
                    '</div>');

                containerRoot = document.getElementById(containerID);

                // Setup fake SimpleSVG instance
                SimpleSVG = {
                    _onIconsAdded: renderImages
                };

                // Load libraries
                load(SimpleSVG);
                SimpleSVG.config.api = SimpleSVG.config.api.replace('{callback}', 'window.SSVGRenderTest2');
                window.SSVGRenderTest2 = SimpleSVG._loaderCallback;

                // Load images, start tests when images are available
                SimpleSVG._findNewImages(containerRoot).forEach(function(image) {
                    if (!SimpleSVG._loadImage(image)) {
                        pending ++;
                    }
                });
                if (!pending) {
                    renderImages();
                }
            }

            // Render images
            function renderImages() {
                SimpleSVG._findNewImages(containerRoot).forEach(function(image) {
                    SimpleSVG._renderSVG(image, true);
                });
                test();
            }

            // Do test
            function test() {
                var image1 = containerRoot.childNodes[0],
                    image2 = containerRoot.childNodes[1];

                expect(image1.tagName.toLowerCase()).to.be.equal('svg-placeholder', 'First image supposed to be placeholder');
                expect(image2.tagName.toLowerCase()).to.be.equal('svg-placeholder', 'Second image supposed to be placeholder');

                expect(image1.getAttribute('class')).to.be.equal('simple-svg', 'Class name should be simple-svg');
                expect(image1.getAttribute('data-icon')).to.be.equal('fa-home', 'data-icon attribute is missing or invalid');
                expect(image1.hasAttribute('xmlns')).to.be.equal(false, 'xmlns is present in placeholder');

                expect(image1.getAttribute('style')).to.be.equal(null, 'First placeholder should not have style attribute');
                expect(image2.getAttribute('style')).to.be.equal(null, 'Second placeholder should not have style attribute');

                // Change images to SVG
                SimpleSVG._findHiddenImages(containerRoot).forEach(function(image) {
                    SimpleSVG._renderSVG(image);
                });

                image1 = containerRoot.childNodes[0];
                image2 = containerRoot.childNodes[1];

                expect(image1.tagName.toLowerCase()).to.be.equal('svg', 'First image supposed to be SVG');
                expect(image2.tagName.toLowerCase()).to.be.equal('svg', 'Second image supposed to be SVG');

                expect(image1.getAttribute('class')).to.be.equal('simple-svg', 'Class name should be simple-svg (2)');
                expect(image1.getAttribute('data-icon')).to.be.equal('fa-home', 'data-icon attribute is missing or invalid 92)');
                expect(image1.hasAttribute('xmlns')).to.be.equal(true, 'xmlns is missing');

                expect(image1.getAttribute('style').indexOf('rotate(360deg)')).to.not.be.equal(-1, 'Style should contain 360deg rotation (2)');
                expect(image2.getAttribute('style').indexOf('rotate(90deg)')).to.not.be.equal(-1, 'Style should contain 90deg rotation');

                done();
            }

            init();
        });
    });
})();
