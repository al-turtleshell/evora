"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeImagesS3 = exports.storeImageS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const storeImageS3 = (s3, bucketName, path) => (imageKey) => __awaiter(void 0, void 0, void 0, function* () {
    const data = fs_1.default.createReadStream(`${path}/${imageKey}.png`);
    const putCommand = new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: imageKey,
        Body: data
    });
    yield s3.send(putCommand);
});
exports.storeImageS3 = storeImageS3;
const storeImagesS3 = (s3, bucketName, path) => (paths) => __awaiter(void 0, void 0, void 0, function* () {
    const storeImage = (0, exports.storeImageS3)(s3, bucketName, path);
    yield Promise.all(paths.map(storeImage));
});
exports.storeImagesS3 = storeImagesS3;
