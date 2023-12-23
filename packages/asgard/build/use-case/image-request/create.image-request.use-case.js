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
exports.createImageRequestUsecase = void 0;
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const E = __importStar(require("fp-ts/lib/Either"));
const image_request_1 = require("../../aggregate/image-request/image-request");
const function_1 = require("fp-ts/lib/function");
const daedelium_1 = require("@turtleshell/daedelium");
const dtos_1 = require("../../aggregate/image-request/dtos");
const createImageRequestUsecase = ({ save, generatePrompt }) => (data) => {
    return (0, function_1.pipe)((0, daedelium_1.decode)(dtos_1.CreateImageRequestDto, data), E.chain(dto => image_request_1.ImageRequest.create(dto)), TE.fromEither, TE.chain(imageRequest => (0, function_1.pipe)(generatePrompt(imageRequest.description, imageRequest.style), TE.map(prompt => image_request_1.ImageRequest.setPrompt(imageRequest, prompt)))), TE.chainEitherK(image_request_1.ImageRequest.toDto), TE.chain(save));
};
exports.createImageRequestUsecase = createImageRequestUsecase;
// export const createImageRequestUsecase = ({ save, generatePrompt }: Context) => (data: CreateImageRequestDto): TE.TaskEither<Miscue, ImageRequestDto> => {
//     return pipe(
//         TE.bindTo("createImageDto")(TE.fromEither(decode(CreateImageRequestDto, data))),
//         TE.bind("imageRequest", ({ createImageDto }) => TE.fromEither(ImageRequest.create(createImageDto))),
//         TE.bind("prompt", ({ imageRequest }) => generatePrompt(imageRequest.description, imageRequest.style)),
//         TE.bind("imageRequestWithPrompt", ({ imageRequest, prompt }) => TE.of(ImageRequest.setPrompt(imageRequest, prompt))),
//         TE.map(({ imageRequestWithPrompt }) => ImageRequest.toDto(imageRequestWithPrompt)),
//     )
// }
