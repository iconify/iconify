/**
 * This file is part of the simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

/**
 * Build packages
 */
"use strict";

const fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    uglify = require('uglify-js'),
    Helper = require('./_helper');

let codeDir = 'src',
    distDir = 'dist',
    baseName = 'simple-svg',
    /**
     * List of files in order of compilation.
     * Dependencies are listed in comments after each image, except for config.js dependence
     *
     * @type {[string]}
     */
    filesOrder = [
        // Core
        'defaults.js',
        'config.js', // requires defaults.js
        'polyfill.js', // requires config.js

        // Common files
        'storage.js',
        'svg.js',

        // Functions to find images
        'image.js',
        'finder.js', // requires image.js
        'loader.js',
        'lazy.js',

        // DOM observer
        'observer.js',

        // DOM manipulations
        'renderer.js', // requires loader.js, image.js

        // Main file
        'index.js',
    ];

let resolvedCodeDir = path.resolve(__dirname, '../' + codeDir),
    resolvedDistDir = path.resolve(__dirname, '../' + distDir),
    compiled = {},
    content;

function addFile(file, callback) {
    let content = fs.readFileSync(resolvedCodeDir + '/' + file, 'utf8').trim(),
        pos;

    // Remove comments at start
    if (content.slice(0, 2) === '/*') {
        pos = content.indexOf('*/');
        if (pos !== -1) {
            content = content.slice(pos + 2).trim();
        }
    }

    // Remove strict
    content = content.replace(/["']use strict["'];\s?/g, '');

    // Handle special common files
    if (file.slice(0, 7) === 'common/') {
        content = '(function (SimpleSVG) {\n\t' +
            content.replace(/\n/g, '\n\t') +
            '\n})(self.SimpleSVG);';

        let split = file.split('/');
        switch (split.pop()) {
            case 'storage.js':
                content = content.replace('module.exports = Storage;', 'SimpleSVG._Storage = Storage;');
                break;

            case 'svg.js':
                content = content.replace('module.exports = SVG;', 'SimpleSVG._SVG = SVG;')
                    .replace('require(\'./storage\')', 'SimpleSVG._Storage');
                break;

            default:
                console.log('Error: no parser for', file);
                process.exit(1);
        }
    }

    if (typeof callback === 'function') {
        content = callback(content);
    }

    return content;
}

// Parse all files
function parse(config) {
    let content = '"use strict;"\n\nself.SimpleSVG = {};\n\n';

    // List of files
    let testFiles = [];
    filesOrder.forEach(file => {
        testFiles.push('common/' + file);
        testFiles.push('browser/' + file);
        testFiles.push('browser/' + (config.observer || config.lazy ? 'with-' : 'no-') + 'polyfill/' + file);
        testFiles.push('browser/' + (config.observer ? 'with-' : 'no-') + 'observer/' + file);
        testFiles.push('browser/' + (config.cdn ? 'with-' : 'no-') + 'cdn/' + file);
        testFiles.push('browser/' + (config.lazy ? 'with-' : 'no-') + 'lazy/' + file);
    });
    if (config.plugins) {
        config.plugins.forEach(plugin => {
            testFiles.push('browser/plugins/' + plugin + '.js');
        });
    }

    // Add all files
    testFiles.forEach(file => {
        if (Helper.exists(resolvedCodeDir + '/' + file)) {
            content += '\n' + addFile(file) + '\n';
        }
    });

    return content;
}

function save(file, content) {
    let size = content.length;

    fs.writeFileSync(resolvedDistDir + '/' + file + '.js', content, 'utf8');

    content = uglify.minify(content, {
        fromString: true
    });
    fs.writeFileSync(resolvedDistDir + '/' + file + '.min.js', content.code);
    console.log('Saved ' + distDir + '/' + file + '.js (' + size + ' bytes full, ' + content.code.length + ' bytes minified)');
}

// Create dist directory
Helper.mkdir(resolvedDistDir);

// Parse with observer
content = parse({
    observer: true,
    cdn: true,
    lazy: false
});
save(baseName, content);

content = parse({
    observer: false,
    cdn: true,
    lazy: false
});
save(baseName + '.without-observer', content);

content = parse({
    observer: false,
    cdn: false,
    lazy: false
});
save(baseName + '.basic', content);
