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
exports.ImageRequest = void 0;
const t = __importStar(require("io-ts"));
const image_1 = require("./image");
const Either_1 = require("fp-ts/lib/Either");
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const uuid_1 = require("uuid");
const function_1 = require("fp-ts/lib/function");
const daedelium_1 = require("@turtleshell/daedelium");
const enums_1 = require("./enums");
const types_1 = require("./types");
const miscue_1 = require("../../miscue");
const ImageRequestCodec = t.intersection([
    t.type({
        id: daedelium_1.UUID,
        status: enums_1.ImageRequestStatusEnum,
        images: t.array(image_1.ImageCodec),
        numberOfImages: types_1.NumberOfImages,
        style: enums_1.ImageStyleEnum,
        description: t.string
    }),
    t.partial({
        prompt: t.string,
    })
]);
const create = ({ id, numberOfImages, style, description, images, prompt, status }) => {
    return (0, daedelium_1.decode)(ImageRequestCodec, {
        id: id !== null && id !== void 0 ? id : (0, uuid_1.v4)(),
        numberOfImages,
        style,
        description,
        prompt,
        status: status !== null && status !== void 0 ? status : enums_1.ImageRequestStatus.PENDING,
        images: images !== null && images !== void 0 ? images : []
    }, miscue_1.ImageRequestCreatingErrorMiscue);
};
const toDto = (imageRequest) => {
    if (imageRequest.prompt === undefined) {
        return (0, Either_1.left)((0, miscue_1.PromptNotSetMiscue)(imageRequest.id));
    }
    return (0, Either_1.right)({
        id: imageRequest.id,
        status: imageRequest.status,
        images: imageRequest.images.map(image => image_1.Image.toDto(image)),
        numberOfImages: imageRequest.numberOfImages,
        style: imageRequest.style,
        description: imageRequest.description,
        prompt: imageRequest.prompt,
    });
};
const addImage = (imageRequest, id) => {
    return (0, function_1.pipe)(image_1.Image.create({ id }), (0, Either_1.map)(image => {
        const images = [...imageRequest.images, image];
        return Object.assign(Object.assign({}, imageRequest), { images, status: images.length === imageRequest.numberOfImages ? enums_1.ImageRequestStatus.TO_REVIEW : enums_1.ImageRequestStatus.IN_PROGRESS });
    }));
};
const addImages = (imageRequest, ids) => {
    return ids.reduce((acc, id) => (0, function_1.pipe)(acc, (0, Either_1.chain)(i => addImage(i, id))), (0, Either_1.right)(imageRequest));
};
const setPrompt = (imageRequest, prompt) => {
    return Object.assign(Object.assign({}, imageRequest), { prompt });
};
const canGenerateImage = (imageRequest) => {
    if (imageRequest.prompt === undefined) {
        return (0, Either_1.left)((0, miscue_1.PromptNotSetMiscue)(imageRequest.id));
    }
    if (imageRequest.status !== enums_1.ImageRequestStatus.PENDING && imageRequest.status !== enums_1.ImageRequestStatus.IN_PROGRESS) {
        return (0, Either_1.left)((0, miscue_1.RequestInvalidStatusMiscue)(imageRequest.id, imageRequest.status));
    }
    return (0, Either_1.right)(imageRequest);
};
const generateImageUrl = (imageRequest, createPresignedUrl) => {
    return (0, function_1.pipe)(TE.traverseArray((image) => (0, function_1.pipe)(createPresignedUrl(image.id), TE.map((url) => image_1.Image.addUrl(image, url))))(imageRequest.images), TE.map((readonlyUpdatedImages) => Array.from(readonlyUpdatedImages)), TE.map((updatedImages) => (Object.assign(Object.assign({}, imageRequest), { images: updatedImages }))));
};
exports.ImageRequest = {
    create,
    toDto,
    addImage,
    addImages,
    setPrompt,
    canGenerateImage,
    generateImageUrl
};
