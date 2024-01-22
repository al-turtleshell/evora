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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImageGenerationService = void 0;
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const function_1 = require("fp-ts/lib/function");
const daedelium_1 = require("@turtleshell/daedelium");
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const selectChannel = (channels, repository) => () => {
    return (0, function_1.pipe)(repository.getFreeChannel(), TE.map(channel => channels.find(chan => chan.id === channel.id)));
};
const setChannelAsBusy = (repository) => (channelId) => {
    return repository.setChannelAsBusy(channelId);
};
const setChannelAsFree = (repository) => (channelId) => {
    return repository.setChannelAsFree(channelId);
};
const cleanUp = (path) => (preview_id, uuids) => {
    const paths = uuids.map(uuid => `./${path}/${uuid}.png`);
    paths.push(`./${path}/preview_${preview_id}.png`);
    return (0, function_1.pipe)(TE.sequenceArray(paths.map(path => TE.tryCatch(() => fs_1.default.promises.unlink(path), () => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.IMAGE_GENERATION_SERVICE_CLEANUP_ERROR,
        message: 'There was an issue while cleaning up',
        timestamp: Date.now(),
    })))), TE.map(() => uuids));
};
const sendImagineCommand = (midjourneyBotId) => (channel, prompt) => {
    return TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
        yield channel.sendSlash(midjourneyBotId, 'imagine', prompt);
    }), () => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.IMAGE_GENERATION_SERVICE_CHANNEL_IMAGINE_COMMAND_ERROR,
        message: 'There was an issue while sending the imagine command',
        timestamp: Date.now(),
    }));
};
const deleteMessage = (channel) => {
    return (0, function_1.pipe)(TE.tryCatch(() => channel.messages.fetch({ limit: 1 }), () => daedelium_1.Miscue.create({
        code: daedelium_1.MiscueCode.IMAGE_GENERATION_ERROR,
        message: 'There was an issue while deleting the message',
        timestamp: Date.now(),
    })), TE.map(messages => { var _a; return (_a = messages.first()) === null || _a === void 0 ? void 0 : _a.delete(); }));
};
const generateImage = (selectChannel, setChannelAsBusy, sendImagineCommand, waitForImageCompletion, downloadImage, cutIntoQuadrant, storeImages, cleanUp, deleteMessage, setChannelAsFree) => (prompt) => {
    const id = (0, uuid_1.v4)();
    return (0, function_1.pipe)(selectChannel(), TE.chain(channel => (0, function_1.pipe)(TE.bindTo('_1')(setChannelAsBusy(channel.id)), TE.bind('_2', () => sendImagineCommand(channel, prompt)), TE.bind('url', () => waitForImageCompletion(channel)), TE.bind('_3', ({ url }) => downloadImage(url, `/preview_${id}.png`)), TE.bind('uuids', () => cutIntoQuadrant(`./preview_${id}.png`)), TE.bind('_4', ({ uuids }) => storeImages(uuids)), TE.bind('_5', ({ uuids }) => cleanUp(id, uuids)), TE.bind('_6', () => setChannelAsFree(channel.id)), TE.bind('_7', () => deleteMessage(channel)), TE.map(({ uuids }) => uuids), TE.mapLeft(miscue => { setChannelAsFree(channel.id)(); deleteMessage(channel); return miscue; }))));
};
const createImageGenerationService = (discordClient, storeImages, repository, midjourneyBotId, path) => {
    return (0, function_1.pipe)(repository.getAllChannel(), TE.chain(channels => {
        return TE.sequenceArray(channels.map(channel => TE.tryCatch(() => discordClient.channels.fetch(channel.id), reason => daedelium_1.Miscue.create({
            code: daedelium_1.MiscueCode.IMAGE_GENERATION_SERVICE_CHANNEL_FETCH_ERROR,
            message: 'There was an issue while fetching a channel',
            timestamp: Date.now(),
            details: `There was an issue while fetching a channel ${reason}`
        }))));
    }), TE.map(channels => {
        const waitForImageCompletion = (channel) => (0, function_1.pipe)((0, daedelium_1.retryAction)(() => (0, function_1.pipe)(TE.tryCatch(() => channel.messages.fetch({ limit: 1 }), () => daedelium_1.Miscue.create({
            code: daedelium_1.MiscueCode.MIDJOURNEY_CANNOT_FETCH_CHANNEL_MESSAGE,
            message: 'Cannot fetch channel message',
            timestamp: Date.now(),
        })), TE.map(messages => messages.first())), (message) => {
            var _a, _b;
            if (!message) {
                return false;
            }
            const attachment = (_b = (_a = message.attachments) === null || _a === void 0 ? void 0 : _a.first()) === null || _b === void 0 ? void 0 : _b.url;
            if (!attachment) {
                return false;
            }
            const content = message.content;
            if (content.includes('%)')) {
                return false;
            }
            return true;
        }, 5, 15000, 'check image completion'), TE.map(message => { var _a, _b; return (_b = (_a = message === null || message === void 0 ? void 0 : message.attachments) === null || _a === void 0 ? void 0 : _a.first()) === null || _b === void 0 ? void 0 : _b.url; }));
        return {
            generateImage: generateImage(selectChannel(channels, repository), setChannelAsBusy(repository), sendImagineCommand(midjourneyBotId), waitForImageCompletion, (0, daedelium_1.downloadImage)(path), (0, daedelium_1.cutIntoQuadrant)(path), storeImages, cleanUp(path), deleteMessage, setChannelAsFree(repository))
        };
    }));
};
exports.createImageGenerationService = createImageGenerationService;
