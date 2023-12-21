"use strict";
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
exports.retryAction = void 0;
const retryAction = (action, condition, maxAttempts = 5, interval = 15000) => __awaiter(void 0, void 0, void 0, function* () {
    let attempts = 0;
    while (attempts < maxAttempts) {
        try {
            const result = yield action();
            if (condition(result)) {
                console.log('Action succeeded');
                return true; // Action succeeded
            }
            else {
                console.log('Action failed, retrying...');
            }
        }
        catch (error) {
            console.error('Action failed with error:', error);
        }
        attempts++;
        yield new Promise(resolve => setTimeout(resolve, interval));
    }
    console.log('Max attempts reached');
    return false; // Action failed after maximum attempts
});
exports.retryAction = retryAction;
