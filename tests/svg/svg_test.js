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
                height: 16,
                inlineHeight: 24
            });
            svg = new SVG(storage.get('test', false));

            expect(svg.toString()).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0.84em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 24"><path d="" /></svg>');
            expect(svg.toString({
                'data-icon-inline': false
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" data-icon-inline="false"><path d="" /></svg>');
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

            expect(svg.toString({
                width: '40px'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40px" height="32px" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');

            // Custom scale
            expect(svg.toString({
                width: 30,
                height: 50
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="50" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');
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
            expect(svg.toString({
                width: false,
                height: false
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');

            // No height
            expect(svg.toString({
                width: 40,
                height: false
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');

            // Invalid width value
            expect(svg.toString({
                width: 'none',
                height: 8
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="none" height="8" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');
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

            expect(svg.toString({
                id: 'test',
                style: 'margin:0; transform: scale(0.5);',
                'class': 'simple-svg test-class loading'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);margin:0; transform: scale(0.5);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" id="test" class="simple-svg test-class loading"><path d="" /></svg>');

            // Values that must be escaped
            expect(svg.toString({
                'data-foo': 'Test" quote',
                'data-<bar': 'Test >\''
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" data-foo="Test&quot; quote" data-&lt;bar="Test &gt;&#039;"><path d="" /></svg>');
        });

        it('transformation', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test-icon', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            storage.addIcon('test-alias1', {
                parent: 'test-icon',
                hFlip: true
            });
            storage.addIcon('test-alias2', {
                parent: 'test-alias1',
                vFlip: true,
                rotate: 1
            });

            // Icon without transformation
            svg = new SVG(storage.get('test-icon'));
            expect(svg.toString()).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');

            // Horizontal flip from parent icon
            svg = new SVG(storage.get('test-alias1'));
            expect(svg.toString()).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: scale(-1, 1); -webkit-transform: scale(-1, 1); transform: scale(-1, 1);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');

            // Horizontal flip from attributes
            svg = new SVG(storage.get('test-icon'));
            expect(svg.toString({
                'data-flip': 'horizontal'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: scale(-1, 1); -webkit-transform: scale(-1, 1); transform: scale(-1, 1);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" data-flip="horizontal"><path d="" /></svg>');

            // Double horizontal flip
            svg = new SVG(storage.get('test-alias1'));
            expect(svg.toString({
                'data-flip': 'horizontal'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" data-flip="horizontal"><path d="" /></svg>');

            // Many attributes from merging aliases
            svg = new SVG(storage.get('test-alias2'));
            expect(svg.toString()).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(270deg); -webkit-transform: rotate(270deg); transform: rotate(270deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');
        });
    });
})();
