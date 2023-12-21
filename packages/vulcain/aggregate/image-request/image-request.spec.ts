import { pipe } from "fp-ts/lib/function";
import { ImageRequest } from '@turtleshell/asgard';
import { map, mapLeft, chain } from 'fp-ts/lib/Either';
import { v4 as uuid } from 'uuid';

import { ImageRequestStatus } from "@turtleshell/asgard/build/aggregate/image-request/image-request";
import { MiscueCode } from "@turtleshell/daedelium";




describe('ImageRequest creation errors', () => {
    it('should return Miscue when numberOfImages is not multiple of 4', () => {
        pipe(
            ImageRequest.create({
                numberOfImages: 0,
                style: 'black_and_white_illustration',
                description: 'A description',
            }),
            mapLeft(miscue => {
                expect(miscue.code).toBe(MiscueCode.IMAGE_REQUEST_CREATING_ERROR);
                expect(miscue.message).toBe('Image request creating failed');
            }),
            map(imageRequest => {
                expect(imageRequest.id).toBeUndefined();
            })
        )
    });

    it('should return Miscue when style is incorrect', () => {
        pipe(
            ImageRequest.create({
                numberOfImages: 24,
                style: 'incorrect_style',
                description: 'A description',
            }),
            mapLeft(miscue => {
                expect(miscue.code).toBe(MiscueCode.IMAGE_REQUEST_CREATING_ERROR);
                expect(miscue.message).toBe('Image request creating failed');
            })
        )
    });
})

describe('ImageRequest creation success', () => {
    it('should create a new Image request object with a default parameters when no parameters are provided', () => {
        pipe(
            ImageRequest.create({
                numberOfImages: 24,
                style: 'black_and_white_illustration',
                description: 'A description',
            }),
            map(imageRequest => {
                expect(imageRequest.id).toBeDefined();
                expect(imageRequest.prompt).toBeUndefined();
                expect(imageRequest.images).toHaveLength(0);
                expect(imageRequest.status).toBe('pending');
                expect(imageRequest.description).toBe('A description');
            })
        )
    });
    it('should create a new Image request object with provided parameters', () => {
        const id = uuid();
        pipe(
            ImageRequest.create({
                id,
                numberOfImages: 24,
                style: 'black_and_white_illustration',
                description: 'A description',
                prompt: 'A prompt',
                status: 'completed',
                images: []
            }),
            map(imageRequest => {
                expect(imageRequest.id).toBeDefined();
                expect(imageRequest.id).toBe(id);
                expect(imageRequest.prompt).toBe('A prompt');
                expect(imageRequest.images).toHaveLength(0);
                expect(imageRequest.status).toBe('completed');
                expect(imageRequest.description).toBe('A description');
                expect(imageRequest.numberOfImages).toBe(24);
            })
        )
    });
    
    it('should create DTO from ImageRequest', () => {
        const id = uuid();
        pipe(
            ImageRequest.create({
                id,
                numberOfImages: 24,
                style: 'black_and_white_illustration',
                description: 'A description',
                prompt: 'A prompt',
                status: 'completed',
                images: []
            }),
            map(imageRequest => {
                const dto = ImageRequest.toDto(imageRequest);
                expect(dto.id).toBe(id);
                expect(dto.prompt).toBe('A prompt');
                expect(dto.images).toHaveLength(0);
                expect(dto.status).toBe('completed');
                expect(dto.description).toBe('A description');
                expect(dto.numberOfImages).toBe(24);
            })
        )
    });
});

describe('ImageRequest addImage', () => {
    it('when an image is add to ImageRequest and not reach numberOfImages, status go to in_progress and image length equals 1', () => {
        const id = uuid();
        const imageId = uuid();
        pipe(
            ImageRequest.create({
                id,
                numberOfImages: 24,
                style: 'black_and_white_illustration',
                description: 'A description',
                prompt: 'A prompt',
                status: 'pending',
                images: []
            }),
            chain(imageRequest => ImageRequest.addImage(imageRequest, imageId)),
            map(imageRequest => {
                expect(imageRequest.id).toBe(id);
                expect(imageRequest.prompt).toBe('A prompt');
                expect(imageRequest.images).toHaveLength(1);
                expect(imageRequest.status).toBe(ImageRequestStatus.IN_PROGRESS);
                expect(imageRequest.description).toBe('A description');
                expect(imageRequest.numberOfImages).toBe(24);
    
            })
        )
    });

    it('when an image is add to ImageRequest and reach numberOfImages, status go to to_review and image length equals numberOfImages', () => {
        const id = uuid();
        pipe(
            ImageRequest.create({
                id,
                numberOfImages: 4,
                style: 'black_and_white_illustration',
                description: 'A description',
                prompt: 'A prompt',
                status: 'pending',
                images: []
            }),
            chain(imageRequest => ImageRequest.addImage(imageRequest, uuid())),
            chain(imageRequest => ImageRequest.addImage(imageRequest, uuid())),
            chain(imageRequest => ImageRequest.addImage(imageRequest, uuid())),
            chain(imageRequest => ImageRequest.addImage(imageRequest, uuid())),
            map(imageRequest => {
                expect(imageRequest.id).toBe(id);
                expect(imageRequest.prompt).toBe('A prompt');
                expect(imageRequest.images).toHaveLength(imageRequest.numberOfImages);
                expect(imageRequest.status).toBe(ImageRequestStatus.TO_REVIEW);
                expect(imageRequest.description).toBe('A description');
                expect(imageRequest.numberOfImages).toBe(4);
    
            })
        )
    });
})

describe('ImageRequest addImages', () => {
    it('when 4 images is add to ImageRequest and not reach numberOfImages, status go to in_progress and image length equals to 4', () => {
        const id = uuid();
        pipe(
            ImageRequest.create({
                id,
                numberOfImages: 24,
                style: 'black_and_white_illustration',
                description: 'A description',
                prompt: 'A prompt',
                status: 'pending',
                images: []
            }),
            chain(imageRequest => ImageRequest.addImages(imageRequest, [uuid(), uuid(), uuid(), uuid()])),
            map(imageRequest => {
                expect(imageRequest.id).toBe(id);
                expect(imageRequest.prompt).toBe('A prompt');
                expect(imageRequest.images).toHaveLength(4);
                expect(imageRequest.status).toBe(ImageRequestStatus.IN_PROGRESS);
                expect(imageRequest.description).toBe('A description');
                expect(imageRequest.numberOfImages).toBe(24);
            })
        )
    });

    it('when an image is add to ImageRequest and reach numberOfImages, status go to to_review and image length equals numberOfImages', () => {
        const id = uuid();
        pipe(
            ImageRequest.create({
                id,
                numberOfImages: 4,
                style: 'black_and_white_illustration',
                description: 'A description',
                prompt: 'A prompt',
                status: 'pending',
                images: []
            }),
            chain(imageRequest => ImageRequest.addImages(imageRequest, [uuid(), uuid(), uuid(), uuid()])),
            map(imageRequest => {
                expect(imageRequest.id).toBe(id);
                expect(imageRequest.prompt).toBe('A prompt');
                expect(imageRequest.images).toHaveLength(imageRequest.numberOfImages);
                expect(imageRequest.status).toBe(ImageRequestStatus.TO_REVIEW);
                expect(imageRequest.description).toBe('A description');
                expect(imageRequest.numberOfImages).toBe(4);
    
            })
        )
    });
})

describe('ImageRequest canGenerateImage', () => {
    it('should return Miscue when imageRequest is not in pending or in_progress status', () => {
        const id = uuid();
        pipe(
            ImageRequest.create({
                id,
                numberOfImages: 4,
                style: 'black_and_white_illustration',
                description: 'A description',
                prompt: 'A prompt',
                status: 'to_review',
                images: []
            }),
            chain(imageRequest => ImageRequest.canGenerateImage(imageRequest)),
            mapLeft(miscue => {
                expect(miscue.code).toBe(MiscueCode.IMAGE_REQUEST_INVALID_STATUS);
            }),
            map(imageRequest => {
                expect(imageRequest).toBeUndefined();
            })
        )
    });

    it('should return Miscue when imageRequest prompt is not set', () => {
        const id = uuid();
        pipe(
            ImageRequest.create({
                id,
                numberOfImages: 4,
                style: 'black_and_white_illustration',
                description: 'A description',
                status: 'pending',
                images: []
            }),
            chain(imageRequest => ImageRequest.canGenerateImage(imageRequest)),
            mapLeft(miscue => {
                expect(miscue.code).toBe(MiscueCode.IMAGE_REQUEST_PROMPT_NOT_SET);
            }),
            map(imageRequest => {
                expect(imageRequest).toBeUndefined();
            })
        )
    });
});

it('should set prompt', () => {
    const id = uuid();
    pipe(
        ImageRequest.create({
            id,
            numberOfImages: 24,
            style: 'black_and_white_illustration',
            description: 'A description',
            prompt: 'A prompt',
            status: 'completed',
            images: []
        }),
        map(imageRequest => ImageRequest.setPrompt(imageRequest, 'A new prompt')),
        map(imageRequest => {
            expect(imageRequest.prompt).toBe('A new prompt');
        })
    )
});