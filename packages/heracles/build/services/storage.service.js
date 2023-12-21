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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const daedelium_1 = require("@turtleshell/daedelium");
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const function_1 = require("fp-ts/lib/function");
const fs_1 = __importDefault(require("fs"));
const createPresignedUrl = (s3, bucket) => (key) => TE.tryCatch(() => {
    {
        const command = new client_s3_1.PutObjectCommand({ Bucket: bucket, Key: key });
        return (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 18000 });
    }
    ;
}, (e) => daedelium_1.Miscue.create({
    code: daedelium_1.MiscueCode.S3_PRESIGNED_URL_GENERATION_ERROR,
    message: 'Cannot create presigned url',
    timestamp: Date.now(),
    details: `Cannot create presigned url for key ${key} in bucket ${bucket}`
}));
const storeImage = (s3, bucketName, path) => (imageKey) => {
    const data = fs_1.default.createReadStream(`${path}/${imageKey}.png`);
    const putCommand = new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: imageKey,
        Body: data
    });
    return (0, function_1.pipe)(TE.tryCatch(() => s3.send(putCommand), () => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.S3_UPLOAD_ERROR,
        message: 'Cannot upload image to S3',
        timestamp: Date.now(),
    })), TE.map(() => imageKey));
};
const createStorageService = (s3, bucketName, path) => {
    const storeImages = (imageKeys) => {
        const storeImageS3 = storeImage(s3, bucketName, path);
        return (0, function_1.pipe)(TE.sequenceArray(imageKeys.map(storeImageS3)), TE.map((keys) => Array.from(keys)));
    };
    return {
        createPresignedUrl: createPresignedUrl(s3, bucketName),
        storeImages,
    };
};
exports.createStorageService = createStorageService;
