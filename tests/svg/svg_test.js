"use strict";

(function() {
    var isBrowser = (typeof module !== 'object' || !module.exports);

    var Storage = isBrowser ? SimpleSVG.modules.Storage : require('../../src/common/storage');
    var SVG = isBrowser ? SimpleSVG.modules.Storage : require('../../src/node/svg');

    var chai = isBrowser ? self.chai : require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing generated SVG', function() {
        it('default dimensions', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            svg = new SVG(storage.get('test', false));

            expect(svg.svgString()).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" width="1.25em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"><path d="" /></svg>');
        });

        it('custom dimensions', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            svg = new SVG(storage.get('test', false));

            expect(svg.svgString({
                width: '40px'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" width="40px" height="32px" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"><path d="" /></svg>');

            // Custom scale
            expect(svg.svgString({
                width: 30,
                height: 50
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" width="30" height="50" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"><path d="" /></svg>');
        });

        it('without width or height', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            svg = new SVG(storage.get('test', false));

            // No width and no height
            expect(svg.svgString({
                width: null,
                height: null
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"><path d="" /></svg>');

            // No height
            expect(svg.svgString({
                width: 40,
                height: null
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" width="40" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"><path d="" /></svg>');

            // Invalid width value
            expect(svg.svgString({
                width: 'none',
                height: 8
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" width="none" height="8" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"><path d="" /></svg>');
        });

        it('custom attributes', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            svg = new SVG(storage.get('test', false));

            expect(svg.svgString({
                id: 'test',
                style: 'margin:0; transform: scale(0.5);',
                'class': 'simple-svg test-class loading'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" width="1.25em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);margin:0; transform: scale(0.5);" id="test" class="simple-svg test-class loading"><path d="" /></svg>');

            // Values that must be escaped
            expect(svg.svgString({
                'data-foo': 'Test" quote',
                'data-<bar': 'Test >\''
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" width="1.25em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" data-foo="Test&quot; quote" data-&lt;bar="Test &gt;&#039;"><path d="" /></svg>');

            // Attributes that are ignored
            expect(svg.svgString({
                body: '<g></g>',
                rotate: 0,
                vFlip: false,
                hFlip: false
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" width="1.25em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"><path d="" /></svg>');

            // Before and after
            expect(svg.svgString({
                before: '<g>',
                after: '</g>'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" width="1.25em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"><g><path d="" /></g></svg>');
        });
    });
})();
