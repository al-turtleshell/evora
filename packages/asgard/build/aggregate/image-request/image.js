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
exports.Image = exports.CreateImageDto = exports.ImageDto = exports.ImageCodec = exports.ImageStatusEnum = exports.ImageStatus = exports.ImageStyleEnum = exports.ImageStyle = void 0;
const t = __importStar(require("io-ts"));
const uuid_1 = require("uuid");
const daedelium_1 = require("@turtleshell/daedelium");
var ImageStyle;
(function (ImageStyle) {
    ImageStyle["BLACK_AND_WHITE_ILLUSTRATION"] = "black_and_white_illustration";
})(ImageStyle || (exports.ImageStyle = ImageStyle = {}));
exports.ImageStyleEnum = t.keyof({
    black_and_white_illustration: null,
});
var ImageStatus;
(function (ImageStatus) {
    ImageStatus["GENERATED"] = "generated";
    ImageStatus["ACCEPTED"] = "accepted";
    ImageStatus["REJECTED"] = "rejected";
})(ImageStatus || (exports.ImageStatus = ImageStatus = {}));
exports.ImageStatusEnum = t.keyof({
    generated: null,
    accepted: null,
    rejected: null,
});
exports.ImageCodec = t.intersection([
    t.type({
        id: daedelium_1.UUID,
        status: exports.ImageStatusEnum,
    }),
    t.partial({
        url: t.string
    })
]);
exports.ImageDto = t.intersection([
    t.type({
        id: t.string,
        status: t.string,
    }),
    t.partial({
        url: t.string
    })
]);
exports.CreateImageDto = t.partial({
    id: t.string,
    status: t.string
});
const create = ({ id, status }) => {
    return (0, daedelium_1.decode)(exports.ImageCodec, { id: id !== null && id !== void 0 ? id : (0, uuid_1.v4)(), status: status !== null && status !== void 0 ? status : ImageStatus.GENERATED }, (details) => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.IMAGE_CREATTNG_ERROR,
        message: 'Image creating failed',
        timestamp: Date.now(),
        details,
    }));
};
const toDto = (image) => {
    return {
        id: image.id,
        status: image.status,
        url: image.url,
    };
};
const addUrl = (image, url) => {
    return Object.assign(Object.assign({}, image), { url });
};
exports.Image = {
    create,
    toDto,
    addUrl,
};
