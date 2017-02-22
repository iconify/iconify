/**
 * This file is part of the @cyberalien/simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * This is not open source library.
 * This library can be used only with products available on artodia.com
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Helper functions  for builders
 */
"use strict";

const fs = require('fs'),
    path = require('path');

let Helper = {};

/**
 * Check if file or directory exists
 *
 * @param {string} file File or directory name
 * @returns {boolean}
 */
Helper.exists = file => {
    try {
        fs.statSync(file);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Remove directory that might not be empty
 *
 * @param {string} dir
 */
Helper.rmdir = dir => {
    if (!Helper.exists(dir)) {
        return;
    }
    fs.readdirSync(dir).forEach(file => {
        let filename = dir + '/' + file;
        if (fs.lstatSync(filename).isDirectory()) {
            Helper.rmdir(filename);
        } else {
            fs.unlinkSync(filename);
        }
    });
    fs.rmdirSync(dir);
};

/**
 * Recursively create directories if they do not exist
 *
 * @param {string} dir
 */
Helper.mkdir = dir => {
    let list = dir.split(path.sep),
        name = '';

    for (let i = 0; i < list.length; i++) {
        name += (i > 0 ? '/' : '') + list[i];
        if (name !== '' && !Helper.exists(name)) {
            try {
                fs.mkdirSync(name, 0o755);
            } catch (e) {
            }
        }
    }
};

/**
 * Replace all entries of string in string
 *
 * Equivalent of php function str_replace()
 *
 * @param {string} search
 * @param {string} replace
 * @param {string} subject
 * @return {string}
 */
Helper.strReplace = (search, replace, subject) => {
    let pos = 0;

    while ((pos = subject.indexOf(search, pos)) !== -1) {
        subject = subject.slice(0, pos) + replace + subject.slice(pos + search.length);
        pos += replace.length;
    }

    return subject;
};

module.exports = Helper;
