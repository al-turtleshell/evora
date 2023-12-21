"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrThrow = void 0;
function getOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is not defined`);
    }
    return value;
}
exports.getOrThrow = getOrThrow;
