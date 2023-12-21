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
exports.retryAction = void 0;
const TE = __importStar(require("fp-ts/TaskEither"));
const function_1 = require("fp-ts/function");
const miscue_1 = require("../miscue");
const miscueMaxRetries = (functionName) => miscue_1.Miscue.create({
    code: miscue_1.MiscueCode.MAX_RETRIES_EXCEEDED_ERROR,
    message: 'Max retries exceeded',
    timestamp: Date.now(),
    details: `Max retries exceeded for function ${functionName}`
});
const retryAction = (action, condition, maxAttempts, interval, functionName, attemptCount = 0) => {
    return (0, function_1.pipe)(action(), TE.chain(result => condition(result) ? TE.right(result) :
        attemptCount >= maxAttempts ? TE.left(miscueMaxRetries(functionName)) :
            (0, function_1.pipe)(TE.rightTask(() => new Promise(resolve => setTimeout(resolve, interval))), TE.chain(() => (0, exports.retryAction)(action, condition, maxAttempts, interval, functionName, attemptCount + 1)))));
};
exports.retryAction = retryAction;
