import * as t from 'io-ts';
import { CreateImageDto, ImageDto, ImageStyleEnum, Image, ImageCodec } from './image';

import { Either, map, left, right, chain } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';

import { v4 as uuid } from 'uuid';
import { pipe } from 'fp-ts/lib/function';

import { Miscue, MiscueCode, UUID, decode } from '@turtleshell/daedelium';

export enum ImageRequestStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    TO_REVIEW = 'to_review',
    COMPLETED = 'completed'
}

export const ImageRequestStatusEnum = t.keyof({
    pending: null,
    in_progress: null,
    to_review: null,
    completed: null
});

export const CreateImageRequestDto = t.intersection([
    t.type({
        numberOfImages: t.number,
        style: t.string,
        description: t.string
    }),
    t.partial({
        id: t.string,
        status: t.string,
        prompt: t.string,
        images: t.array(CreateImageDto),
    })
]);

export type CreateImageRequestDto = t.TypeOf<typeof CreateImageRequestDto>;

const ImageRequestDto = t.intersection([
    t.type({
        id: t.string,
        status: t.string,
        images: t.array(ImageDto),
        numberOfImages: t.number,
        style: t.string,
        description: t.string
    }),
    t.partial({
        prompt: t.string,
    })
]);

export type ImageRequestDto = t.TypeOf<typeof ImageRequestDto>;


const isNumberOfImages = (n: unknown): n is number => 
  typeof n === 'number' && n % 4 === 0 && n > 0;

const NumberOfImages = new t.Type<number, number, unknown>(
  'NumberOfImages',
  isNumberOfImages,
  (input, context) => isNumberOfImages(input) ? t.success(input) : t.failure(input, context),
  t.identity
);

const ImageRequestCodec = t.intersection([
    t.type({
        id: UUID,
        status: ImageRequestStatusEnum,
        images: t.array(ImageCodec),
        numberOfImages: NumberOfImages,
        style: ImageStyleEnum,
        description: t.string
    }),
    t.partial({
        prompt: t.string,
    })
]);

export type ImageRequest = t.TypeOf<typeof ImageRequestCodec>;


const create = ({id, numberOfImages, style, description, images, prompt, status} : CreateImageRequestDto): Either<Miscue, ImageRequest> => {
    return decode(ImageRequestCodec, {
        id: id ?? uuid(),
        numberOfImages,
        style,
        description,
        prompt,
        status: status ?? ImageRequestStatus.PENDING,
        images: images ?? []
        },
        (details?: string) => Miscue.create({
            code: MiscueCode.IMAGE_REQUEST_CREATING_ERROR,
            message: 'Image request creating failed',
            timestamp: Date.now(),
            details,
        })
    );
}

const toDto = (imageRequest: ImageRequest): ImageRequestDto => {
    return {
        id: imageRequest.id,
        status: imageRequest.status,
        images: imageRequest.images.map(image => Image.toDto(image)),
        numberOfImages: imageRequest.numberOfImages,
        style: imageRequest.style,
        description: imageRequest.description,
        prompt: imageRequest.prompt,
    }
}

const addImage = (imageRequest: ImageRequest, id: string): Either<Miscue, ImageRequest> => {
    return pipe(
        Image.create({id}),
        map(image => {
            const images = [...imageRequest.images, image];
            
            return {
                ...imageRequest,
                images,
                status: images.length === imageRequest.numberOfImages ? ImageRequestStatus.TO_REVIEW : ImageRequestStatus.IN_PROGRESS
            }
        }
    ));
}

const addImages = (imageRequest: ImageRequest, ids: string[]): Either<Miscue, ImageRequest> => {
    return ids.reduce((acc: Either<Miscue, ImageRequest>, id) => pipe(
        acc,
        chain(i => addImage(i, id))
    ), right(imageRequest));
}

const setPrompt = (imageRequest: ImageRequest, prompt: string): ImageRequest => {
    return {
        ...imageRequest,
        prompt
    }
}

const canGenerateImage = (imageRequest: ImageRequest): Either<Miscue, ImageRequest> => {

    if (imageRequest.prompt === undefined) {
        return left(Miscue.create({
            code: MiscueCode.IMAGE_REQUEST_PROMPT_NOT_SET,
            message: 'Prompt is undefined',
            timestamp: Date.now(),
            details: `Prompt is undefined for image request with id ${imageRequest.id}`
        }));
    }

    if (imageRequest.status !== ImageRequestStatus.PENDING && imageRequest.status !== ImageRequestStatus.IN_PROGRESS) {
        return left(Miscue.create({
            code: MiscueCode.IMAGE_REQUEST_INVALID_STATUS,
            message: 'Image request status is invalid',
            timestamp: Date.now(),
            details: `Image request with id ${imageRequest.id} has status ${imageRequest.status}`
        }));
    }

    return right(imageRequest);
}

const generateImageUrl = (imageRequest: ImageRequest, createPresignedUrl: (key: string) => TE.TaskEither<Miscue, string>)
: TE.TaskEither<Miscue, ImageRequest> => {
    return pipe(
        TE.traverseArray((image: Image) =>
            pipe(
                createPresignedUrl(image.id),
                TE.map((url) => Image.addUrl(image, url))
            )
        )(imageRequest.images),
        TE.map((readonlyUpdatedImages) => Array.from(readonlyUpdatedImages)),
        TE.map((updatedImages) => ({
            ...imageRequest,
            images: updatedImages
        }))
    );
}
export const ImageRequest = {
    create,
    toDto,
    addImage,
    addImages,
    setPrompt,
    canGenerateImage,
    generateImageUrl
}

