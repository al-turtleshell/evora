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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutIntoQuadrant = void 0;
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const function_1 = require("fp-ts/lib/function");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const miscue_1 = require("../miscue");
const cutIntoQuadrant = (folderPath) => (filename) => {
    const inputPath = `${folderPath}/${filename}`;
    const extractAndSaveQuadrant = (inputPath, outputPath, quadrantWidth, quadrantHeight, i, j, uuid) => TE.tryCatch(() => (0, sharp_1.default)(inputPath)
        .extract({
        left: i * quadrantWidth,
        top: j * quadrantHeight,
        width: quadrantWidth,
        height: quadrantHeight
    })
        .toFile(`${outputPath}/${uuid}.png`), (reason) => miscue_1.Miscue.create({
        code: miscue_1.MiscueCode.CUT_INTO_QUADRANT_ERROR,
        message: 'Cannot cut into quadrant',
        timestamp: Date.now(),
        details: `${reason}`
    }));
    return (0, function_1.pipe)(TE.tryCatch(() => (0, sharp_1.default)(inputPath).metadata(), (reason) => (miscue_1.Miscue.create({
        code: miscue_1.MiscueCode.CUT_INTO_QUADRANT_ERROR,
        message: 'Cannot cut into quadrant',
        timestamp: Date.now(),
        details: `Cannot get metadata for ${inputPath} ${reason}`
    }))), TE.chain(({ width, height }) => width && height ? TE.right({ width, height }) : TE.left(miscue_1.Miscue.create({
        code: miscue_1.MiscueCode.CUT_INTO_QUADRANT_ERROR,
        message: 'Cannot cut into quadrant',
        timestamp: Date.now(),
        details: `Cannot get metadata for ${inputPath}`
    }))), TE.chain(({ width, height }) => {
        const quadrantWidth = Math.floor(width / 2);
        const quadrantHeight = Math.floor(height / 2);
        const uuids = [(0, uuid_1.v4)(), (0, uuid_1.v4)(), (0, uuid_1.v4)(), (0, uuid_1.v4)()];
        return (0, function_1.pipe)(TE.sequenceArray(uuids.flatMap((uuid, index) => {
            const i = Math.floor(index / 2);
            const j = index % 2;
            return extractAndSaveQuadrant(inputPath, folderPath, quadrantWidth, quadrantHeight, i, j, uuid);
        })), TE.map(() => uuids));
    }));
};
exports.cutIntoQuadrant = cutIntoQuadrant;
