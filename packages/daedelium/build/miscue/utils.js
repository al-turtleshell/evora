"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = void 0;
const Either_1 = require("fp-ts/lib/Either");
const miscue_1 = require("./miscue");
const function_1 = require("fp-ts/lib/function");
const miscue_code_1 = require("./miscue-code");
const io_ts_reporters_1 = __importDefault(require("io-ts-reporters"));
const decode = (codec, input, miscue) => {
    return (0, function_1.pipe)(codec.decode(input), (0, Either_1.fold)(
    // On failure, return a Miscue with error details
    errors => (0, Either_1.left)(miscue ? miscue(io_ts_reporters_1.default.report((0, Either_1.left)(errors)).join('\n')) : miscue_1.Miscue.create({
        code: miscue_code_1.MiscueCode.VALIDATION_DATA_ERROR,
        message: 'Validation failed',
        timestamp: Date.now(),
        details: io_ts_reporters_1.default.report((0, Either_1.left)(errors)).join('\n')
    })), 
    // On success, return the decoded data
    Either_1.right));
};
exports.decode = decode;
