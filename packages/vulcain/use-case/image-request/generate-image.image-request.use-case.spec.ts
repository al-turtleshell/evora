
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { v4 as uuid } from 'uuid';
import { generateImageImageRequestUsecase } from '@turtleshell/asgard/build/use-case/image-request/generate-image.image-request.use-case';
import { Miscue, MiscueCode } from '@turtleshell/daedelium';
import { ImageRequestDto } from '@turtleshell/asgard/build/aggregate/image-request/dtos';
import { ImageRequestStatus } from '@turtleshell/asgard/build/aggregate/image-request/enums';

const getByIdFnSuccess = (imageRequestId: string): TE.TaskEither<Miscue, ImageRequestDto> => {
    return TE.right({
        id: imageRequestId,
        prompt: 'prompt',
        images: [],
        status: 'pending',
        numberOfImages: 4,
        style: 'black_and_white_illustration',
        description: 'description',
    });
}

const getByIdFnSuccess24 = (imageRequestId: string): TE.TaskEither<Miscue, ImageRequestDto> => {
    return TE.right({
        id: imageRequestId,
        prompt: 'prompt',
        images: [],
        status: 'pending',
        numberOfImages: 24,
        style: 'black_and_white_illustration',
        description: 'description',
    });
}

const getByIdFnSuccessCompleted = (imageRequestId: string): TE.TaskEither<Miscue, ImageRequestDto> => {
    return TE.right({
        id: imageRequestId,
        prompt: 'prompt',
        images: [],
        status: 'completed',
        numberOfImages: 24,
        style: 'black_and_white_illustration',
        description: 'description',
    });
}

const getByIdFnSuccessNoPrompt = (imageRequestId: string): TE.TaskEither<Miscue, ImageRequestDto> => {
    return TE.right({
        id: imageRequestId,
        images: [],
        status: 'completed',
        prompt: '',
        numberOfImages: 24,
        style: 'black_and_white_illustration',
        description: 'description',
    });
}
const getByIdFnFailed = (imageRequestId: string): TE.TaskEither<Miscue, ImageRequestDto> => {
    return TE.left(Miscue.create({
        code: MiscueCode.DATABASE_NOT_FOUND_ERROR,
        message: 'Image request not found',
        timestamp: Date.now(),
        details: `Image request with id ${imageRequestId} not found`,
    }));
}

const generateImageFnSuccess = (prompt: string): TE.TaskEither<Miscue, string[]> => {
    return TE.right([uuid(), uuid(), uuid(), uuid()]);
}

const generateImageFnSuccessWrongUuid = (prompt: string): TE.TaskEither<Miscue, string[]> => {
    return TE.right(['WRONG_UUID']);
}

const generateImageFnFailed = (prompt: string): TE.TaskEither<Miscue, string[]> => {
    return TE.left(Miscue.create({
        code: MiscueCode.IMAGE_GENERATION_ERROR,
        message: 'Error generating image',
        timestamp: Date.now(),
        details: `Error generating image for prompt ${prompt}`,
    }));
}

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

describe('Use case error path', () => {
    it('should return Miscue on ImageRequest not found', async () => {
        await pipe(
             generateImageImageRequestUsecase({ 
                save: saveFnSuccess,
                getById: getByIdFnFailed,
                generateImage: generateImageFnSuccess,
            })('12'),
             TE.mapLeft((error) => {
                 expect(error.code).toBe(MiscueCode.DATABASE_NOT_FOUND_ERROR);
                 expect(error.details).toBe('Image request with id 12 not found');
             }),
             TE.map((data) => {
                 expect(data).toBeUndefined();
             })
        )()
    });
 
    it('should return Miscue on Image Request create failed', async () => {
        await pipe(
            generateImageImageRequestUsecase({ 
            save: saveFnSuccess,
            getById: getByIdFnSuccess,
            generateImage: generateImageFnFailed,
        })('12'),
            TE.mapLeft((error) => {
                expect(error.code).toBe(MiscueCode.IMAGE_REQUEST_CREATING_ERROR);
            }),
            TE.map((data) => {
                expect(data).toBeUndefined();
            })
        )()
    });

    it('should return Miscue on Image generation error', async () => {
        await pipe(
                generateImageImageRequestUsecase({ 
                save: saveFnSuccess,
                getById: getByIdFnSuccess,
                generateImage: generateImageFnFailed,
            })(uuid()),
                TE.mapLeft((error) => {
                expect(error.code).toBe(MiscueCode.IMAGE_GENERATION_ERROR);
                expect(error.details).toBe('Error generating image for prompt prompt');
                }),
                TE.map((data) => {
                    expect(data).toBeUndefined();
                })
        )()
    });

    it('should return Miscue on Image request cannot not generate image when incorrect status', async () => {
        await pipe(
            generateImageImageRequestUsecase({ 
            save: saveFnSuccess,
            getById: getByIdFnSuccessCompleted,
            generateImage: generateImageFnFailed,
        })('4e9d60be-324d-46f3-b3ed-6ad15c6bebd5'),
            TE.mapLeft((error) => {
                expect(error.code).toBe(MiscueCode.IMAGE_REQUEST_INVALID_STATUS);
                expect(error.details).toBe('Image request with id 4e9d60be-324d-46f3-b3ed-6ad15c6bebd5 has status completed');
            }),
            TE.map((data) => {
                expect(data).toBeUndefined();
            })
        )()
    });
  
    it('should return Miscue on Image request cannot not add Image', async () => {
        await pipe(
            generateImageImageRequestUsecase({ 
            save: saveFnSuccess,
            getById: getByIdFnSuccess,
            generateImage: generateImageFnSuccessWrongUuid,
        })('4e9d60be-324d-46f3-b3ed-6ad15c6bebd5'),
            TE.mapLeft((error) => {
                expect(error.code).toBe(MiscueCode.IMAGE_CREATTNG_ERROR);
            }),
            TE.map((data) => {
                expect(data).toBeUndefined();
            })
        )()
    });

    it('should return Miscue on Image request cannot not save Image', async () => {
        await pipe(
            generateImageImageRequestUsecase({ 
            save: saveFnFailed,
            getById: getByIdFnSuccess,
            generateImage: generateImageFnSuccess,
        })('4e9d60be-324d-46f3-b3ed-6ad15c6bebd5'),
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
    it('should return ImageRequestDto on success with status to review', async () => {
        await pipe(
            generateImageImageRequestUsecase({ 
            save: saveFnSuccess,
            getById: getByIdFnSuccess,
            generateImage: generateImageFnSuccess,
        })('4e9d60be-324d-46f3-b3ed-6ad15c6bebd5'),
            TE.mapLeft((error) => {
                expect(error).toBeUndefined();
            }),
            TE.map((data) => {
                expect(data).toBeDefined();
                expect(data.id).toBe('4e9d60be-324d-46f3-b3ed-6ad15c6bebd5');
                expect(data.prompt).toBe('prompt');
                expect(data.images.length).toBe(4);
                expect(data.status).toBe(ImageRequestStatus.TO_REVIEW);
            })
        )()
    });

    it('should return ImageRequestDto on success with status to in_progress', async () => {
        await pipe(
            generateImageImageRequestUsecase({ 
            save: saveFnSuccess,
            getById: getByIdFnSuccess24,
            generateImage: generateImageFnSuccess,
        })('4e9d60be-324d-46f3-b3ed-6ad15c6bebd5'),
            TE.mapLeft((error) => {
                expect(error).toBeUndefined();
            }),
            TE.map((data) => {
                expect(data).toBeDefined();
                expect(data.id).toBe('4e9d60be-324d-46f3-b3ed-6ad15c6bebd5');
                expect(data.prompt).toBe('prompt');
                expect(data.images.length).toBe(4);
                expect(data.status).toBe(ImageRequestStatus.IN_PROGRESS);
            })
        )()
    });
});