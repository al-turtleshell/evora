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
exports.listImageRequestUsecase = void 0;
const function_1 = require("fp-ts/lib/function");
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const t = __importStar(require("io-ts"));
const daedelium_1 = require("@turtleshell/daedelium");
const enums_1 = require("../../aggregate/image-request/enums");
const aggregate_1 = require("../../aggregate");
const schema = t.partial({
    limit: t.number,
    status: t.array(enums_1.ImageRequestStatusEnum),
    skip: t.number,
});
const listImageRequestUsecase = ({ getAll, createPresignedUrl }) => (params) => {
    if (!createPresignedUrl) {
        return (0, function_1.pipe)((0, daedelium_1.decode)(schema, params), TE.fromEither, TE.chain(getAll));
    }
    return (0, function_1.pipe)((0, daedelium_1.decode)(schema, params), TE.fromEither, TE.chain(getAll), TE.chain(imageRequestDtos => TE.traverseArray((imageRequestDto) => (0, function_1.pipe)(TE.fromEither(aggregate_1.ImageRequest.create(imageRequestDto)), TE.chain(imageRequest => aggregate_1.ImageRequest.generateImageUrl(imageRequest, createPresignedUrl))))(imageRequestDtos)), TE.chain(imageRequests => TE.traverseArray((imageRequest) => TE.fromEither(aggregate_1.ImageRequest.toDto(imageRequest)))(imageRequests)), TE.map(imageRequestDtos => Array.from(imageRequestDtos)));
};
exports.listImageRequestUsecase = listImageRequestUsecase;
