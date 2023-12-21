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
exports.getDiscordClient = void 0;
const daedelium_1 = require("@turtleshell/daedelium");
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
const dotenv_1 = __importDefault(require("dotenv"));
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const function_1 = require("fp-ts/lib/function");
dotenv_1.default.config();
let discord;
const getDiscordClient = () => {
    if (!discord) {
        return (0, function_1.pipe)((0, daedelium_1.get)(process.env)('DISCORD_USER_TOKEN_ID'), TE.fromEither, TE.chain(token => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            discord = new discord_js_selfbot_v13_1.Client({
                checkUpdate: false,
            });
            yield discord.login(token);
            return discord;
        }), () => daedelium_1.Miscue.create({
            code: daedelium_1.MiscueCode.MIDJOURNEY_CLIENT_ERROR,
            message: 'There was an issue while getting the discord client',
            timestamp: Date.now(),
        }))));
    }
    return TE.of(discord);
};
exports.getDiscordClient = getDiscordClient;
