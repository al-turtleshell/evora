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
exports.getS3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const E = __importStar(require("fp-ts/lib/Either"));
const dotenv_1 = __importDefault(require("dotenv"));
const function_1 = require("fp-ts/lib/function");
const daedelium_1 = require("@turtleshell/daedelium");
dotenv_1.default.config();
let s3client;
const getS3Client = () => {
    if (s3client) {
        return E.right(s3client);
    }
    const env = (0, daedelium_1.get)(process.env);
    return (0, function_1.pipe)(E.bindTo('accessKeyId')(env('AWS_ACCESS_KEY_ID')), E.bind('secretAccessKey', () => env('AWS_SECRET_ACCESS_KEY')), E.bind('region', () => env('AWS_REGION')), E.map(({ accessKeyId, secretAccessKey, region }) => {
        s3client = new client_s3_1.S3({
            credentials: {
                accessKeyId,
                secretAccessKey
            },
            region
        });
        return s3client;
    }));
};
exports.getS3Client = getS3Client;
