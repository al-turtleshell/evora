"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = void 0;
const zod_1 = require("zod");
function validateData(schema, data) {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw error; // refacto to throw ValidationError
        }
        throw error; // rethrow the error if it's not a ZodError
    }
}
exports.validateData = validateData;
