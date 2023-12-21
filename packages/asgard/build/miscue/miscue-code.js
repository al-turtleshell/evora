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
exports.MiscueCode = exports.MiscueCodeEnum = void 0;
const t = __importStar(require("io-ts"));
exports.MiscueCodeEnum = t.keyof({
    'ir-0000': null,
    'ir-0001': null,
    'ir-0002': null,
    'i-0000': null,
    '1000': null,
    '1001': null,
    '1002': null,
    '1003': null,
    '1004': null,
    '1005': null,
    'cm-0000': null,
    'cm-0001': null,
});
var MiscueCode;
(function (MiscueCode) {
    MiscueCode["VALIDATION_DATA_ERROR"] = "1000";
    MiscueCode["PROMPT_GENERATION_ERROR"] = "1001";
    MiscueCode["DATABASE_SAVE_ERROR"] = "1002";
    MiscueCode["IMAGE_GENERATION_ERROR"] = "1003";
    MiscueCode["DATABASE_NOT_FOUND_ERROR"] = "1004";
    MiscueCode["S3_PRESIGNED_GENERATION_ERROR"] = "1005";
    MiscueCode["DOWNLOAD_IMAGE_ERROR"] = "cm-0000";
    MiscueCode["WRITE_FILE_ERROR"] = "cm-0001";
    MiscueCode["IMAGE_REQUEST_CREATING_ERROR"] = "ir-0000";
    MiscueCode["IMAGE_REQUEST_PROMPT_NOT_SET"] = "ir-0001";
    MiscueCode["IMAGE_REQUEST_INVALID_STATUS"] = "ir-0002";
    MiscueCode["IMAGE_CREATTNG_ERROR"] = "i-0000";
})(MiscueCode || (exports.MiscueCode = MiscueCode = {}));
