"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForFile = void 0;
const fs = require('fs');
function waitForFile(filename, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        function checkFile() {
            fs.access(filename, fs.constants.F_OK, (err) => {
                if (!err) {
                    resolve();
                }
                else {
                    if (Date.now() - startTime > timeout) {
                        reject(new Error('File did not become accessible in time'));
                    }
                    else {
                        setTimeout(checkFile, 500); // check every 500 milliseconds
                    }
                }
            });
        }
        checkFile();
    });
}
exports.waitForFile = waitForFile;
// Usage example
