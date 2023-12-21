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
exports.loadConfiguration = void 0;
const daedelium_1 = require("@turtleshell/daedelium");
const dotenv_1 = __importDefault(require("dotenv"));
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const function_1 = require("fp-ts/lib/function");
dotenv_1.default.config();
const loadConfiguration = () => {
    const env = (0, daedelium_1.get)(process.env);
    return (0, function_1.pipe)(TE.bindTo('midjourneyBotId')(TE.fromEither(env('DISCORD_MIDJOURNEY_BOT_ID'))), TE.bind('imageFolder', () => TE.fromEither(env('IMAGE_FOLDER'))), TE.bind('region', () => TE.fromEither(env('AWS_REGION'))), TE.bind('bucketName', () => TE.fromEither(env('AWS_S3_BUCKET_NAME'))), TE.map(({ midjourneyBotId, imageFolder, region, bucketName }) => ({
        midjourneyBotId,
        region,
        bucketName,
        imageFolder
    })));
};
exports.loadConfiguration = loadConfiguration;
