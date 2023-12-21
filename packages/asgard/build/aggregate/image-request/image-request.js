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
exports.ImageRequest = exports.CreateImageRequestDto = exports.ImageRequestStatusEnum = exports.ImageRequestStatus = void 0;
const t = __importStar(require("io-ts"));
const image_1 = require("./image");
const Either_1 = require("fp-ts/lib/Either");
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const uuid_1 = require("uuid");
const function_1 = require("fp-ts/lib/function");
const daedelium_1 = require("@turtleshell/daedelium");
var ImageRequestStatus;
(function (ImageRequestStatus) {
    ImageRequestStatus["PENDING"] = "pending";
    ImageRequestStatus["IN_PROGRESS"] = "in_progress";
    ImageRequestStatus["TO_REVIEW"] = "to_review";
    ImageRequestStatus["COMPLETED"] = "completed";
})(ImageRequestStatus || (exports.ImageRequestStatus = ImageRequestStatus = {}));
exports.ImageRequestStatusEnum = t.keyof({
    pending: null,
    in_progress: null,
    to_review: null,
    completed: null
});
exports.CreateImageRequestDto = t.intersection([
    t.type({
        numberOfImages: t.number,
        style: t.string,
        description: t.string
    }),
    t.partial({
        id: t.string,
        status: t.string,
        prompt: t.string,
        images: t.array(image_1.CreateImageDto),
    })
]);
const ImageRequestDto = t.intersection([
    t.type({
        id: t.string,
        status: t.string,
        images: t.array(image_1.ImageDto),
        numberOfImages: t.number,
        style: t.string,
        description: t.string
    }),
    t.partial({
        prompt: t.string,
    })
]);
const isNumberOfImages = (n) => typeof n === 'number' && n % 4 === 0 && n > 0;
const NumberOfImages = new t.Type('NumberOfImages', isNumberOfImages, (input, context) => isNumberOfImages(input) ? t.success(input) : t.failure(input, context), t.identity);
const ImageRequestCodec = t.intersection([
    t.type({
        id: daedelium_1.UUID,
        status: exports.ImageRequestStatusEnum,
        images: t.array(image_1.ImageCodec),
        numberOfImages: NumberOfImages,
        style: image_1.ImageStyleEnum,
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
        status: status !== null && status !== void 0 ? status : ImageRequestStatus.PENDING,
        images: images !== null && images !== void 0 ? images : []
    }, (details) => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.IMAGE_REQUEST_CREATING_ERROR,
        message: 'Image request creating failed',
        timestamp: Date.now(),
        details,
    }));
};
const toDto = (imageRequest) => {
    return {
        id: imageRequest.id,
        status: imageRequest.status,
        images: imageRequest.images.map(image => image_1.Image.toDto(image)),
        numberOfImages: imageRequest.numberOfImages,
        style: imageRequest.style,
        description: imageRequest.description,
        prompt: imageRequest.prompt,
    };
};
const addImage = (imageRequest, id) => {
    return (0, function_1.pipe)(image_1.Image.create({ id }), (0, Either_1.map)(image => {
        const images = [...imageRequest.images, image];
        return Object.assign(Object.assign({}, imageRequest), { images, status: images.length === imageRequest.numberOfImages ? ImageRequestStatus.TO_REVIEW : ImageRequestStatus.IN_PROGRESS });
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
        return (0, Either_1.left)(daedelium_1.Miscue.create({
            code: daedelium_1.MiscueCode.IMAGE_REQUEST_PROMPT_NOT_SET,
            message: 'Prompt is undefined',
            timestamp: Date.now(),
            details: `Prompt is undefined for image request with id ${imageRequest.id}`
        }));
    }
    if (imageRequest.status !== ImageRequestStatus.PENDING && imageRequest.status !== ImageRequestStatus.IN_PROGRESS) {
        return (0, Either_1.left)(daedelium_1.Miscue.create({
            code: daedelium_1.MiscueCode.IMAGE_REQUEST_INVALID_STATUS,
            message: 'Image request status is invalid',
            timestamp: Date.now(),
            details: `Image request with id ${imageRequest.id} has status ${imageRequest.status}`
        }));
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
