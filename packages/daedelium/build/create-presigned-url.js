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
exports.createPresignedUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const miscue_1 = require("./miscue");
const createPresignedUrl = ({ s3, bucket }) => (key) => TE.tryCatch(() => {
    {
        const command = new client_s3_1.PutObjectCommand({ Bucket: bucket, Key: key });
        return (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 18000 });
    }
    ;
}, (e) => miscue_1.Miscue.create({
    code: miscue_1.MiscueCode.S3_PRESIGNED_URL_GENERATION_ERROR,
    message: 'Cannot create presigned url',
    timestamp: Date.now(),
    details: `Cannot create presigned url for key ${key} in bucket ${bucket}`
}));
exports.createPresignedUrl = createPresignedUrl;
