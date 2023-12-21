"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TaskEither_1 = require("fp-ts/TaskEither");
const function_1 = require("fp-ts/function");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
// export const downloadImage = async (url: string, path: string) => {
//     const response = await axios({
//         method: 'GET',
//         url: url,
//         responseType: 'stream'
//     });
//     return new Promise<void>((resolve, reject) => {
//         response.data.pipe(fs.createWriteStream(path))
//             .on('finish', () => resolve())
//             .on('error', (e: unknown) => reject(e));
//     });
// }
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
// Download image and return it as a buffer
const downloadImage = (url) => (0, TaskEither_1.tryCatch)(() => axios_1.default.get(url, { responseType: 'arraybuffer' })
    .then(response => Buffer.from(response.data, 'binary')), reason => new Error(String(reason)));
// Write the buffer to a file
const writeToFile = (path, data) => (0, TaskEither_1.tryCatch)(() => writeFile(path, data).then(() => path), reason => new Error(String(reason)));
// Function to download an image, write it to a path, and return the path
const downloadAndWriteImage = (url, path) => (0, function_1.pipe)(downloadImage(url), (0, TaskEither_1.chain)(buffer => writeToFile(path, buffer)));
