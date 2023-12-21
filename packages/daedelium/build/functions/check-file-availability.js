"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileAvailability = void 0;
const fs_1 = require("fs");
const TE = __importStar(require("fp-ts/TaskEither"));
const function_1 = require("fp-ts/function");
const miscue_1 = require("../miscue");
const checkFileAvailability = (path) => {
    return (0, function_1.pipe)(TE.tryCatch(() => fs_1.promises.access(path, fs_1.promises.constants.F_OK)
        .then(() => true)
        .catch((error) => {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }), (e) => miscue_1.Miscue.create({
        code: miscue_1.MiscueCode.FILE_ERROR,
        message: 'Error while checking file availability',
        timestamp: Date.now(),
        details: `${e}`
    })));
};
exports.checkFileAvailability = checkFileAvailability;
