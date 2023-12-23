import * as t from 'io-ts';
import {  Image, ImageCodec } from './image';
import { Either, map, left, right, chain } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { v4 as uuid } from 'uuid';
import { pipe } from 'fp-ts/lib/function';
import { Miscue, MiscueCode, UUID, decode } from '@turtleshell/daedelium';
import { ImageRequestStatus, ImageRequestStatusEnum, ImageStyleEnum } from './enums';
import { NumberOfImages } from './types';
import { CreateImageRequestDto, ImageRequestDto } from './dtos';
import { ImageRequestCreatingErrorMiscue, PromptNotSetMiscue, RequestInvalidStatusMiscue } from '../../miscue';

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
        ImageRequestCreatingErrorMiscue
    );
}

const toDto = (imageRequest: ImageRequest): Either<Miscue, ImageRequestDto> => {
    if (imageRequest.prompt === undefined) {
        return left(PromptNotSetMiscue(imageRequest.id));
    }

    return right({
        id: imageRequest.id,
        status: imageRequest.status,
        images: imageRequest.images.map(image => Image.toDto(image)),
        numberOfImages: imageRequest.numberOfImages,
        style: imageRequest.style,
        description: imageRequest.description,
        prompt: imageRequest.prompt,
    });
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
        return left(PromptNotSetMiscue(imageRequest.id));
    }

    if (imageRequest.status !== ImageRequestStatus.PENDING && imageRequest.status !== ImageRequestStatus.IN_PROGRESS) {
        return left(RequestInvalidStatusMiscue(imageRequest.id, imageRequest.status));
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

