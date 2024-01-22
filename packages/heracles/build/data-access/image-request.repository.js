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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRequestRepository = void 0;
const prisma_client_1 = require("../clients/prisma.client");
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const daedelium_1 = require("@turtleshell/daedelium");
const enums_1 = require("@turtleshell/asgard/build/aggregate/image-request/enums");
const prisma = (0, prisma_client_1.getPrismaClient)();
const save = (imageRequest) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const exist = yield prisma.imageRequest.findUnique({
            where: {
                id: imageRequest.id
            },
            include: {
                images: true
            }
        });
        if (exist) {
            // await prisma.imageRequest.update({
            //     where: {
            //         id: imageRequest.id
            //     },
            //     data: {
            //         numberOfImages: imageRequest.numberOfImages,
            //         style: imageRequest.style as ImageStyle,
            //         description: imageRequest.description,
            //         prompt: imageRequest.prompt,
            //         status: imageRequest.status as ImageRequestStatus
            //     }
            // });
            // await prisma.image.createMany({
            //     data: imageRequest.images.map(image => ({
            //         id: image.id,
            //         imageRequestId: imageRequest.id,
            //         status: image.status as ImageStatus
            //     }))
            // })
            // return;
            yield prisma.image.deleteMany({
                where: {
                    imageRequestId: imageRequest.id
                }
            });
            yield prisma.imageRequest.delete({
                where: {
                    id: imageRequest.id
                }
            });
        }
        yield prisma.imageRequest.create({
            data: {
                id: imageRequest.id,
                numberOfImages: imageRequest.numberOfImages,
                style: imageRequest.style,
                description: imageRequest.description,
                prompt: imageRequest.prompt,
                status: imageRequest.status,
            }
        });
        yield prisma.image.createMany({
            data: imageRequest.images.map(image => ({
                id: image.id,
                imageRequestId: imageRequest.id,
                status: image.status
            }))
        });
    }));
    return imageRequest;
}), (reason) => daedelium_1.Miscue.create({
    code: daedelium_1.MiscueCode.IMAGE_REQUEST_DATABASE_SAVE_ERROR,
    message: 'Image request creating failed',
    timestamp: Date.now(),
    details: `${reason}`
}));
const getById = (id) => {
    return TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
        const imageRequest = yield prisma.imageRequest.findUnique({
            where: {
                id
            },
            include: {
                images: true
            }
        });
        if (!imageRequest) {
            throw new Error('Image request not found');
        }
        return imageRequest;
    }), (reason) => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.IMAGE_REQUEST_NOT_FOUND_ERROR,
        message: 'Image request not found',
        timestamp: Date.now(),
        details: `Image request not found ${reason} for id ${id}`
    }));
};
const getAll = ({ limit, status, skip }) => {
    return TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.imageRequest.findMany({
            include: {
                images: true
            },
            where: {
                OR: status ? status.map(s => ({ status: s })) : undefined
            },
            take: limit !== null && limit !== void 0 ? limit : undefined,
            skip: skip !== null && skip !== void 0 ? skip : 0
        });
    }), (reason) => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.DATABASE_ERROR,
        message: 'Database error',
        timestamp: Date.now(),
        details: `Database error ${reason}`
    }));
};
const getImageRequestToReview = () => {
    return TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.imageRequest.findMany({
            include: {
                images: true
            },
            where: {
                OR: [
                    { status: enums_1.ImageRequestStatus.TO_REVIEW },
                    { status: enums_1.ImageRequestStatus.IN_PROGRESS }
                ]
            },
        });
    }), (reason) => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.DATABASE_ERROR,
        message: 'Database error',
        timestamp: Date.now(),
        details: `Database error ${reason}`
    }));
};
exports.ImageRequestRepository = {
    save,
    getById,
    getAll,
    getImageRequestToReview
};
