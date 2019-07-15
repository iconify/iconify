/**
 * Build test
 */
"use strict";

const fs = require('fs');

module.exports = (Helper, codeDir, testFile, TestHelper) => {
    let code = fs.readFileSync(testFile, 'utf8'),
        modules = [
            TestHelper.fakeEvents() +
            TestHelper.fakeInit() +
            TestHelper.getPrefix() +
            TestHelper.getStorage() +
            fs.readFileSync(codeDir + '/browser/storage.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/defaults.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/with-api/defaults.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/config.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/image.js', 'utf8'),

            // Temporary functions
            'Iconify.testLoaderURL = function() { return true; };' +

            // Replace content of addScript()
            fs.readFileSync(codeDir + '/browser/with-api/loader.js', 'utf8').replace('// Create script', 'if (!Iconify.testLoaderURL(url)) return;')
        ];

    // Replace code
    modules = modules.join('');

    // Merge modules and test
    code = code.replace('/* Modules() */', modules);

    return code;
};
