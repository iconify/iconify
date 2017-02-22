(function() {
    "use strict";

    var expect = chai.expect,
        should = chai.should();

    function load(SimpleSVG) {
        /* Modules() */
    }

    describe('Testing image loader', function() {
        it('loading images', function(done) {
            var SimpleSVG = {},
                containerID = 'loader-basic',
                firstCallback = true,
                containerRoot, apple, star, star2, star3;

            // Add few DOM elements
            jQuery('#debug').append('<div id="' + containerID + '">' +
                    '<i class="fa fa-apple" />' +
                    '<i class="star" data-icon="fa-star" />' +
                    '<i class="another-star" />' +
                    '<i class="third-star" />' +
                '</div>');

            containerRoot = document.getElementById(containerID);

            // Setup fake SimpleSVG instance
            SimpleSVG = {
                _onIconsAdded: function() {
                    if (firstCallback) {
                        // First time callback is called, check class names
                        expect(apple.element.classList.contains('svg-loading')).to.be.equal(true, 'apple icon should have class svg-loading');
                        expect(star.element.classList.contains('svg-loading')).to.be.equal(true, 'star icon should have class svg-loading');
                        expect(star2.element.classList.contains('svg-loading')).to.be.equal(false, 'star2 icon should not have class svg-loading');

                        // Check if icons exist
                        expect(SimpleSVG.iconExists('fa-apple')).to.be.equal(true, 'fa-apple should exist');
                        expect(SimpleSVG.iconExists('fa-star')).to.be.equal(true, 'fa-star should exist');
                        expect(SimpleSVG.iconExists('fa-star-half-full')).to.be.equal(false, 'fa-star-half-full should not exist (2)');
                        expect(SimpleSVG.iconExists('fa-star-half-empty')).to.be.equal(false, 'fa-star-half-empty should not exist (2)');

                        // loadImage should return true for existing icon
                        expect(SimpleSVG._loadImage(star)).to.be.equal(true, 'fa-star should be loaded (1)');
                        expect(SimpleSVG._loadImage(star2)).to.be.equal(true, 'fa-star should be loaded (2)');

                        // Load 1 more icon
                        expect(SimpleSVG._loadImage(star3)).to.be.equal(false, 'fa-star-half-full should not be loaded');

                        firstCallback = false;
                        return;
                    }

                    // Second time callback is called, check class names
                    expect(star3.element.classList.contains('svg-loading')).to.be.equal(true, 'star3 icon should have class svg-loading');
                    expect(star2.element.classList.contains('svg-loading')).to.be.equal(false, 'star2 icon should not have class svg-loading');

                    // Check if icons exist
                    expect(SimpleSVG.iconExists('fa-star-half-full')).to.be.equal(true, 'fa-star-half-full should exist');
                    expect(SimpleSVG.iconExists('fa-star-half-empty')).to.be.equal(true, 'fa-star-half-empty should exist - alias of fa-star-half-full');

                    expect(SimpleSVG._loadImage(star2)).to.be.equal(true, 'star2 should be loaded');
                    expect(SimpleSVG._loadImage(star2)).to.be.equal(true, 'star2 should be loaded');

                    done();
                }
            };

            // Load libraries
            load(SimpleSVG);
            SimpleSVG.config.api = SimpleSVG.config.api.replace('{callback}', 'window.SSVGLoaderTest1');
            window.SSVGLoaderTest1 = SimpleSVG._loaderCallback;

            // Find icons
            apple = SimpleSVG._newImage(containerRoot.querySelector('.fa.fa-apple'), 'fa-apple', null);
            star = SimpleSVG._newImage(containerRoot.querySelector('.star'), 'fa-star', null);
            star2 = SimpleSVG._newImage(containerRoot.querySelector('.another-star'), 'fa-star', null);
            // fa-star-half-full is alias of fa-star-half-empty
            star3 = SimpleSVG._newImage(containerRoot.querySelector('.third-star'), 'fa-star-half-full', null);

            // Check if icons exist
            expect(SimpleSVG.iconExists('fa-apple')).to.be.equal(false, 'fa-apple should not exist');
            expect(SimpleSVG.iconExists('fa-star')).to.be.equal(false, 'fa-star should not exist');
            expect(SimpleSVG.iconExists('fa-star-half-full')).to.be.equal(false, 'fa-star-half-full should not exist');
            expect(SimpleSVG.iconExists('fa-star-half-empty')).to.be.equal(false, 'fa-star-half-empty should not exist');

            // Load icons
            expect(SimpleSVG._loadImage(apple)).to.be.equal(false, 'fa-apple should not be loaded');
            expect(SimpleSVG._loadImage(star)).to.be.equal(false, 'fa-star should not be loaded');
        });
    });
})();
