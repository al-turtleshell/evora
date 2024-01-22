import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { createImageRequestUsecase } from '@turtleshell/asgard/build/use-case/image-request/create.image-request.use-case';
import { ImageStatus, ImageStyle } from '@turtleshell/asgard/build/aggregate/image-request/enums';
import { v4 as uuid } from "uuid";
import { Miscue, MiscueCode } from "@turtleshell/daedelium";
import { ImageRequestDto } from "@turtleshell/asgard/build/aggregate/image-request/dtos";

const saveFnSuccess = (data: ImageRequestDto) => TE.tryCatch(
    () => Promise.resolve(data), 
    () => Miscue.create({
        code: MiscueCode.DATABASE_ERROR, 
        message: 'Database save error',
        timestamp: Date.now(),
    })
);

const saveFnFailed = (data: ImageRequestDto) => TE.tryCatch(
    () => Promise.reject(data), 
    () => Miscue.create({
        code: MiscueCode.DATABASE_ERROR, 
        message: 'Database save error',
        timestamp: Date.now(),
    })
);

const generatePromptFnSuccess = (description: string, style: string) => TE.tryCatch(
    () => Promise.resolve('prompt'), 
    () => Miscue.create({
        code: MiscueCode.PROMPT_GENERATION_ERROR, 
        message: 'Prompt generation error',
        timestamp: Date.now(),
    })
);

const generatePromptFnFailed = (description: string, style: string) => TE.tryCatch(
    () => Promise.reject('prompt'), 
    () => Miscue.create({
        code: MiscueCode.PROMPT_GENERATION_ERROR, 
        message: 'Prompt generation error',
        timestamp: Date.now(),
    })
);

describe('Use case error path', () => {
    it('should return Miscue on data validation error, during creation', () => {
       pipe(
            createImageRequestUsecase({ save: saveFnSuccess, generatePrompt: generatePromptFnSuccess })({ numberOfImages: 24, description: 'test', style: 'test' }),
            TE.mapLeft((error) => {
                expect(error.code).toBe(MiscueCode.IMAGE_REQUEST_CREATING_ERROR);
            }),
            TE.map((data) => {
                expect(data).toBeUndefined();
            })
       )()
    });

    it('should return Miscue on prompt generation error', () => {
        pipe(
            createImageRequestUsecase({ save: saveFnSuccess, generatePrompt: generatePromptFnFailed })({ numberOfImages: 24, description: 'test', style: ImageStyle.BLACK_AND_WHITE_ILLUSTRATION }),
            TE.mapLeft((error) => {
                expect(error.code).toBe(MiscueCode.PROMPT_GENERATION_ERROR);
            }),
            TE.map((data) => {
                expect(data).toBeUndefined();
            })
       )()
    });
    
    it('should return Miscue on database save error', () => {
        pipe(
            createImageRequestUsecase({ save: saveFnFailed, generatePrompt: generatePromptFnSuccess })({ numberOfImages: 24, description: 'test', style: ImageStyle.BLACK_AND_WHITE_ILLUSTRATION }),
            TE.mapLeft((error) => {
                expect(error.code).toBe(MiscueCode.DATABASE_ERROR);
            }),
            TE.map((data) => {
                expect(data).toBeUndefined();
            })
       )()
    });
});


describe('Use case success path', () => {
    it('should return ImageRequestDto on success', () => {
        pipe(
            createImageRequestUsecase({ save: saveFnSuccess, generatePrompt: generatePromptFnSuccess })({ numberOfImages: 24, description: 'test', style: ImageStyle.BLACK_AND_WHITE_ILLUSTRATION }),
            TE.mapLeft((error) => {
                expect(error).toBeUndefined();
            }),
            TE.map((data) => {
                expect(data).toBeDefined();
            })
       )()
    });

    it('should return ImageRequestDto on success with images',async () => {
        await pipe(
            createImageRequestUsecase({ save: saveFnSuccess, generatePrompt: generatePromptFnSuccess })({ numberOfImages: 24, description: 'test', style: ImageStyle.BLACK_AND_WHITE_ILLUSTRATION, images: [{ id: uuid(), status: ImageStatus.GENERATED }] }),
            TE.mapLeft((error) => {
                expect(error).toBeUndefined();
            }),
            TE.map((data) => {
                expect(data).toBeDefined();
            })
       )()
    });
});