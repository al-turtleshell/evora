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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutIntoQuadrant = void 0;
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const wait_for_file_1 = require("./wait-for-file");
const cutIntoQuadrant = (inputPath, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    const uuids = [(0, uuid_1.v4)(), (0, uuid_1.v4)(), (0, uuid_1.v4)(), (0, uuid_1.v4)()];
    let ind = 0;
    (0, sharp_1.default)(inputPath)
        .metadata()
        .then(({ width, height }) => {
        if (width && height) {
            // Calculate dimensions for each quadrant
            const quadrantWidth = Math.floor(width / 2);
            const quadrantHeight = Math.floor(height / 2);
            // Extract each quadrant
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    (0, sharp_1.default)(inputPath)
                        .extract({
                        left: i * quadrantWidth,
                        top: j * quadrantHeight,
                        width: quadrantWidth,
                        height: quadrantHeight
                    })
                        .toFile(`${outputPath}/${uuids[ind]}.png`)
                        .then(() => {
                        console.log(`Quadrant ${i}_${j} extracted`);
                    })
                        .catch(err => console.error(err));
                    ind++;
                }
            }
        }
    })
        .catch(err => console.error(err));
    console.log('here');
    yield Promise.all(uuids.map((uuid) => __awaiter(void 0, void 0, void 0, function* () { return (0, wait_for_file_1.waitForFile)(`${outputPath}/${uuid}.pnxg`); })));
    return uuids;
});
exports.cutIntoQuadrant = cutIntoQuadrant;
