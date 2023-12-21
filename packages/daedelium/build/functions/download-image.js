"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadImage = void 0;
const TaskEither_1 = require("fp-ts/TaskEither");
const function_1 = require("fp-ts/function");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const miscue_1 = require("../miscue");
const retry_action_1 = require("./retry-action");
const check_file_availability_1 = require("./check-file-availability");
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const MiscueDownloadImageError = (details) => miscue_1.Miscue.create({
    code: miscue_1.MiscueCode.DOWNLOAD_IMAGE_ERROR,
    message: 'Download image error',
    timestamp: Date.now(),
    details
});
const MiscueWriteFileError = (details) => miscue_1.Miscue.create({
    code: miscue_1.MiscueCode.WRITE_FILE_ERROR,
    message: 'Write file error',
    timestamp: Date.now(),
    details
});
const download = (url) => (0, TaskEither_1.tryCatch)(() => axios_1.default.get(url, { responseType: 'arraybuffer' })
    .then(response => Buffer.from(response.data, 'binary')), reason => MiscueDownloadImageError(String(reason)));
const writeToFile = (path, data) => (0, TaskEither_1.tryCatch)(() => writeFile(path, data).then(() => path), reason => MiscueWriteFileError(String(reason)));
const waitForFileAvailability = (path) => (0, function_1.pipe)((0, retry_action_1.retryAction)(() => (0, check_file_availability_1.checkFileAvailability)(path), (r) => r === true, 5, 15000, 'check file availability'), (0, TaskEither_1.map)(() => path));
const downloadImage = (basePath) => (url, filename) => (0, function_1.pipe)(download(url), (0, TaskEither_1.chain)(buffer => writeToFile(`${basePath}/${filename}`, buffer)), (0, TaskEither_1.chain)(waitForFileAvailability));
exports.downloadImage = downloadImage;
