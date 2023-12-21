
import { ImageRequestDto, ImageRequestStatus } from '@turtleshell/asgard/build/aggregate/image-request/image-request';

import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { v4 as uuid } from 'uuid';
import { getImageRequestUsecase } from '@turtleshell/asgard/build/use-case/image-request/get.image-request.use-case';
import { ImageStatus } from '@turtleshell/asgard/build/aggregate/image-request/image';
import { Miscue, MiscueCode } from '@turtleshell/daedelium';

const getByIdFnSuccess = (imageRequestId: string): TE.TaskEither<Miscue, ImageRequestDto> => {
    return TE.right({
        id: imageRequestId,
        prompt: 'prompt',
        images: [{
            id: uuid(),
            status: ImageStatus.GENERATED
        },
        {
            id: uuid(),
            status: ImageStatus.GENERATED
        }],
        status: ImageRequestStatus.IN_PROGRESS,
        numberOfImages: 4,
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

const createPresignedUrlFnSuccess = (key: string): TE.TaskEither<Miscue, string> => {
    return TE.right('https://www.google.com');
}

const createPresignedUrlFnFailed = (key: string): TE.TaskEither<Miscue, string> => {
    return TE.left(Miscue.create({
        code: MiscueCode.S3_PRESIGNED_GENERATION_ERROR,
        message: 'Cannot create presigned url',
        timestamp: Date.now(),
        details: `S3 error for key ${key}`,
    }));
}

describe('Use case error path', () => {
    it('should return a Miscue when the image request is not found', async () => {
        pipe(
            getImageRequestUsecase({ getById: getByIdFnFailed, createPresignedUrl: createPresignedUrlFnSuccess })(uuid()),
            TE.mapLeft(miscue => { 
                expect(miscue.code).toBe(MiscueCode.DATABASE_NOT_FOUND_ERROR);
    
                expect(miscue.timestamp).toBeDefined();
            }),
            TE.map(data => {
                expect(data).toBeUndefined();
            })
        )();
    });

    it('should return a Miscue when the presigned generation failed', async () => {
        pipe(
            getImageRequestUsecase({ getById: getByIdFnSuccess, createPresignedUrl: createPresignedUrlFnFailed })(uuid()),
            TE.mapLeft(miscue => { 
                expect(miscue.code).toBe(MiscueCode.S3_PRESIGNED_GENERATION_ERROR);
    
                expect(miscue.timestamp).toBeDefined();
            }),
            TE.map(data => {
    
                expect(data).toBeUndefined();
            })
        )();
    });
});

describe('Use case success path', () => {
    it('should return an image request with generated images', async () => {
        pipe(
            getImageRequestUsecase({ getById: getByIdFnSuccess, createPresignedUrl: createPresignedUrlFnSuccess })(uuid()),
            TE.map(data => {

                expect(data).toBeDefined();
                expect(data.id).toBeDefined();
                expect(data.prompt).toBeDefined();
                expect(data.images).toBeDefined();
                expect(data.images.length).toBe(2);
                expect(data.status).toBe(ImageRequestStatus.IN_PROGRESS);
                expect(data.numberOfImages).toBeDefined();
                expect(data.style).toBeDefined();
                expect(data.description).toBeDefined();
            }),
            TE.mapLeft(miscue => { 
                expect(miscue).toBeUndefined();
            })
        )();
    });
});