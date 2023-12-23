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
exports.getImageRequestUsecase = void 0;
const function_1 = require("fp-ts/lib/function");
const image_request_1 = require("../../aggregate/image-request/image-request");
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const t = __importStar(require("io-ts"));
const daedelium_1 = require("@turtleshell/daedelium");
const getImageRequestUsecase = ({ getById, createPresignedUrl }) => (imageRequestId) => {
    return (0, function_1.pipe)((0, daedelium_1.decode)(t.string, imageRequestId), TE.fromEither, TE.chain(getById), TE.chainEitherK(image_request_1.ImageRequest.create), TE.chain(imageRequest => image_request_1.ImageRequest.generateImageUrl(imageRequest, createPresignedUrl)), TE.chainEitherK(image_request_1.ImageRequest.toDto));
};
exports.getImageRequestUsecase = getImageRequestUsecase;
