/**
 * Build test
 */
"use strict";

const fs = require('fs');

module.exports = (Helper, codeDir, testFile) => {
    let code = fs.readFileSync(testFile, 'utf8'),
        observerCode = fs.readFileSync(codeDir + '/browser/with-observer/observer.js', 'utf8'),
        search, pos, index;

    // Change observer code
    search = '(function';
    pos = observerCode.indexOf(search);
    if (pos === -1) {
        throw new Error('Could not find required code in observer.js');
    }
    observerCode = 'function Observer' + observerCode.slice(pos + search.length);

    search = '})(self.SimpleSVG, self);';
    pos = observerCode.indexOf(search);
    if (pos === -1) {
        throw new Error('Could not find required code in observer.js');
    }
    observerCode = observerCode.slice(0, pos) + '}';

    // Merge observer and test
    code = code.replace('/* Observer() */', observerCode);

    return code;
};
