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
exports.MidjourneyChannelRepository = void 0;
const prisma_client_1 = require("../clients/prisma.client");
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const daedelium_1 = require("@turtleshell/daedelium");
const prisma = (0, prisma_client_1.getPrismaClient)();
const getAllChannel = () => {
    return TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
        const channels = yield prisma.midjourneyChannel.findMany();
        return channels;
    }), (e) => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.MIDJOURNEY_DATABASE_ERROR,
        message: 'There was an issue while getting the channels',
        timestamp: Date.now(),
        details: `There was an issue while getting the channels ${e}`
    }));
};
const getFreeChannel = () => {
    return TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
        const channel = yield prisma.midjourneyChannel.findFirst({
            where: {
                busy: false
            }
        });
        if (!channel) {
            throw new Error('No free channel found');
        }
        return channel;
    }), (reason) => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.MIDJOURNEY_NO_FREE_CHANNEL_ERROR,
        message: 'There was an issue while getting a free channel',
        timestamp: Date.now(),
        details: `There was an issue while getting a free channel ${reason}`
    }));
};
const setChannelAsBusy = (channelId) => {
    return TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.midjourneyChannel.update({
            where: {
                id: channelId
            },
            data: {
                busy: true
            }
        });
    }), (reason) => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.MIDJOURNEY_DATABASE_ERROR,
        message: 'There was an issue while setting the channel as busy',
        timestamp: Date.now(),
        details: `There was an issue while setting the channel as busy ${reason}`
    }));
};
const setChannelAsFree = (channelId) => {
    return TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.midjourneyChannel.update({
            where: {
                id: channelId
            },
            data: {
                busy: false
            }
        });
    }), (reason) => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.MIDJOURNEY_DATABASE_ERROR,
        message: 'There was an issue while setting the channel as free',
        timestamp: Date.now(),
        details: `There was an issue while setting the channel as free ${reason}`
    }));
};
exports.MidjourneyChannelRepository = {
    getAllChannel,
    getFreeChannel,
    setChannelAsBusy,
    setChannelAsFree
};
