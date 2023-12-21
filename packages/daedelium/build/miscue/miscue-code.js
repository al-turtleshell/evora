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
    'ir-0003': null,
    'ir-0004': null,
    'i-0000': null,
    '1000': null,
    '1001': null,
    '1002': null,
    '1003': null,
    '1004': null,
    '1005': null,
    'cm-0000': null,
    'cm-0001': null,
    'cm-0002': null,
    'cm-0003': null,
    'cm-0004': null,
    'cm-0005': null,
    'cm-0006': null,
    'cm-0007': null,
    'cm-0008': null,
    'm-0000': null,
    'm-0001': null,
    'm-0002': null,
    'm-0003': null,
    'igs-0000': null,
    'igs-0001': null,
    'igs-0002': null,
    'fs-0000': null,
    'fs-0001': null,
    'a-0000': null,
});
var MiscueCode;
(function (MiscueCode) {
    MiscueCode["VALIDATION_DATA_ERROR"] = "1000";
    MiscueCode["PROMPT_GENERATION_ERROR"] = "1001";
    MiscueCode["DATABASE_ERROR"] = "1002";
    MiscueCode["IMAGE_GENERATION_ERROR"] = "1003";
    MiscueCode["DATABASE_NOT_FOUND_ERROR"] = "1004";
    MiscueCode["AUTH_SESSION_NOT_FOUND_ERROR"] = "a-0000";
    MiscueCode["FILE_ERROR"] = "fs-0000";
    MiscueCode["FILE_ACCESS_ERROR"] = "fs-0001";
    MiscueCode["DOWNLOAD_IMAGE_ERROR"] = "cm-0000";
    MiscueCode["WRITE_FILE_ERROR"] = "cm-0001";
    MiscueCode["RETRY_ACTION_ERROR"] = "cm-0002";
    MiscueCode["MAX_RETRIES_EXCEEDED_ERROR"] = "cm-0003";
    MiscueCode["CANNOT_GET_ENV_VARIABLE"] = "cm-0004";
    MiscueCode["S3_PRESIGNED_URL_GENERATION_ERROR"] = "cm-0005";
    MiscueCode["CUT_INTO_QUADRANT_ERROR"] = "cm-0006";
    MiscueCode["S3_UPLOAD_ERROR"] = "cm-0007";
    MiscueCode["LOAD_CONFIGURATION_ERROR"] = "cm-0008";
    MiscueCode["IMAGE_REQUEST_CREATING_ERROR"] = "ir-0000";
    MiscueCode["IMAGE_REQUEST_PROMPT_NOT_SET"] = "ir-0001";
    MiscueCode["IMAGE_REQUEST_INVALID_STATUS"] = "ir-0002";
    MiscueCode["IMAGE_REQUEST_DATABASE_SAVE_ERROR"] = "ir-0003";
    MiscueCode["IMAGE_REQUEST_NOT_FOUND_ERROR"] = "ir-0004";
    MiscueCode["IMAGE_CREATTNG_ERROR"] = "i-0000";
    MiscueCode["MIDJOURNEY_CLIENT_ERROR"] = "m-0003";
    MiscueCode["MIDJOURNEY_NO_FREE_CHANNEL_ERROR"] = "m-0000";
    MiscueCode["MIDJOURNEY_DATABASE_ERROR"] = "m-0001";
    MiscueCode["MIDJOURNEY_CANNOT_FETCH_CHANNEL_MESSAGE"] = "m-0002";
    MiscueCode["IMAGE_GENERATION_SERVICE_CLEANUP_ERROR"] = "igs-0000";
    MiscueCode["IMAGE_GENERATION_SERVICE_CHANNEL_FETCH_ERROR"] = "igs-0001";
    MiscueCode["IMAGE_GENERATION_SERVICE_CHANNEL_IMAGINE_COMMAND_ERROR"] = "igs-0002";
})(MiscueCode || (exports.MiscueCode = MiscueCode = {}));
