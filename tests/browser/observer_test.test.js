(function() {
    "use strict";

    var expect = chai.expect,
        should = chai.should();

    /**
     * Skip 2 ticks. Observer class uses 2 ticks to do its magic, so test must skip 2 ticks before asserting
     *
     * @param callback
     */
    function skipTicks(callback) {
        setTimeout(function() {
            setTimeout(callback, 0);
        }, 0);
    }

    /* Observer() */

    describe('Testing observer', function() {
        it('inactive observer', function(done) {
            var context, Iconify, local,
                tempId = 'observer-dummy',
                called = false;

            // Check if jQuery is present
            expect(typeof jQuery).to.be.equal('function', 'jQuery is missing');

            // Add temporary element
            jQuery('#debug').append('<div id="' + tempId + '" />');

            // Setup fake global scope and Iconify instance
            context = {
                MutationObserver: MutationObserver
            };
            Iconify = {
                isReady: true
            };
            local = {
                config: {
                    _root: document.getElementById(tempId)
                },
                initQueue: [],
                readyQueue: [],
                scanDOM: function(nodes) {
                    called = true;
                }
            };

            // Load observer
            Observer(Iconify, local, context);

            expect(typeof Iconify.pauseObserving).to.be.equal('function', 'Iconify.pauseObserving is missing');
            expect(typeof Iconify.resumeObserving).to.be.equal('function', 'Iconify.resumeObserving is missing');

            // Do not initialize observer!

            // Check if observer is working
            expect(called).to.be.equal(false, 'Observer callback was triggered too early');
            jQuery('#' + tempId).append('<div />');
            skipTicks(function() {
                expect(called).to.be.equal(false, 'Observer callback was triggered, but it was supposed to be dummy function');
                done();
            });
        });

        it('setting up working observer', function(done) {
            var context, Iconify, local,
                tempId = 'observer-basic',
                called = false;

            // Check if MutationObserver and jQuery are present
            expect(!!MutationObserver).to.be.equal(true, 'This browser does not support MutationObserver. Test with modern browser');
            expect(!!jQuery).to.be.equal(true, 'jQuery is missing');

            // Add temporary element
            jQuery('#debug').append('<div id="' + tempId + '" />');

            // Setup fake global scope and Iconify instance
            context = {
                MutationObserver: MutationObserver
            };
            Iconify = {
                isReady: true
            };
            local = {
                config: {
                    _root: document.getElementById(tempId)
                },
                readyQueue: [],
                scanDOM: function() {
                    called = true;
                }
            };

            // Load observer
            Observer(Iconify, local, context);

            expect(typeof Iconify.pauseObserving).to.be.equal('function', 'Iconify.pauseObserving is missing');
            expect(typeof Iconify.resumeObserving).to.be.equal('function', 'Iconify.resumeObserving is missing');

            // Init observer
            local.readyQueue.forEach(function(callback) {
                callback();
            });

            // Check if observer is working
            expect(called).to.be.equal(false, 'Observer callback was triggered too early');
            jQuery('#' + tempId).append('<span />');

            skipTicks(function() {
                expect(called).to.be.equal(true, 'Observer callback was not triggered');
                done();
            });
        });

        it('pause and resume observer', function(done) {
            var context, Iconify, local,
                tempId = 'observer-pause',
                callbackResult = false;

            // Check if MutationObserver and jQuery are present
            expect(!!MutationObserver).to.be.equal(true, 'This browser does not support MutationObserver. Test with modern browser');
            expect(!!jQuery).to.be.equal(true, 'jQuery is missing');

            // Add temporary element
            jQuery('#debug').append('<div id="' + tempId + '" />');

            // Setup fake global scope and Iconify instance
            context = {
                MutationObserver: MutationObserver
            };
            Iconify = {
                isReady: true
            };
            local = {
                config: {
                    _root: document.getElementById(tempId)
                },
                readyQueue: [],
                scanDOM: function(nodes) {
                    callbackResult = nodes;
                }
            };

            // Load observer
            Observer(Iconify, local, context);

            expect(typeof Iconify.pauseObserving).to.be.equal('function', 'Iconify.pauseObserving is missing');
            expect(typeof Iconify.resumeObserving).to.be.equal('function', 'Iconify.resumeObserving is missing');

            // Init observer
            local.readyQueue.forEach(function(callback) {
                callback();
            });

            // Call observer
            expect(callbackResult).to.be.equal(false, 'Observer callback was triggered too early');
            jQuery('#' + tempId).append('<p />');

            skipTicks(function() {
                expect(callbackResult).to.not.be.equal(false, 'Observer callback was not triggered');
                expect(callbackResult.length).to.be.equal(1, 'Observer was supposed to return 1 node');

                // Pause observer
                callbackResult = false;
                Iconify.pauseObserving();

                // Add element
                jQuery('#' + tempId).append('<i />');
                skipTicks(function () {
                    expect(callbackResult).to.be.equal(false, 'Observer was supposed to be paused');

                    // Resume observer
                    Iconify.resumeObserving();

                    // Add elements
                    jQuery('#' + tempId).append('<strong /><span /><i />');

                    skipTicks(function () {
                        expect(callbackResult).to.not.be.equal(false, 'Observer was supposed to have resumed working');
                        expect(callbackResult.length).to.be.equal(3, 'Observer was supposed to return 3 nodes');

                        done();
                    });
                });
            });
        });
    });
})();
