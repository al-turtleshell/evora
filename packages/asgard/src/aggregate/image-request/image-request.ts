import * as t from 'io-ts';
import {  Image, ImageCodec } from './image';
import { Either, map, left, right, chain } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { v4 as uuid } from 'uuid';
import { pipe } from 'fp-ts/lib/function';
import { Miscue, MiscueCode, UUID, decode } from '@turtleshell/daedelium';
import { ImageRequestProject, ImageRequestProjectEnum, ImageRequestStatus, ImageRequestStatusEnum, ImageStatus, ImageStyleEnum } from './enums';
import { NumberOfImages } from './types';
import { CreateImageRequestDto, ImageRequestDto } from './dtos';
import { ImageRequestCreatingErrorMiscue, PromptNotSetMiscue, RequestInvalidStatusMiscue } from '../../miscue';

const ImageRequestCodec =
    t.type({
        id: UUID,
        status: ImageRequestStatusEnum,
        project: ImageRequestProjectEnum,
        images: t.array(ImageCodec),
        numberOfImages: NumberOfImages,
        style: ImageStyleEnum,
        description: t.string,
        prompt: t.string
    });


export type ImageRequest = t.TypeOf<typeof ImageRequestCodec>;


const create = ({id, numberOfImages, style, description, images, prompt, status, project} : CreateImageRequestDto): Either<Miscue, ImageRequest> => {
    return decode(ImageRequestCodec, {
        id: id ?? uuid(),
        numberOfImages: project == ImageRequestProject.ADOBE_STOCK ? 64 : numberOfImages,
        style,
        description,
        prompt,
        project,
        status: status ?? ImageRequestStatus.PENDING,
        images: images ?? []
        },
        ImageRequestCreatingErrorMiscue
    );
}

const toDto = (imageRequest: ImageRequest): Either<Miscue, ImageRequestDto> => {
    return right({
        id: imageRequest.id,
        status: imageRequest.status,
        images: imageRequest.images.map(image => Image.toDto(image)),
        numberOfImages: imageRequest.numberOfImages,
        style: imageRequest.style,
        project: imageRequest.project,
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

const review = (imageRequest: ImageRequest): TE.TaskEither<Miscue, ImageRequest> => {
    const check = imageRequest.images.every(image => image.status === ImageStatus.ACCEPTED || image.status === ImageStatus.REJECTED);
    if (!check) {
        return TE.left(Miscue.create({
            code: MiscueCode.IMAGE_REQUEST_REVIEW_ERROR,
            message: 'Image request review failed',
            timestamp: Date.now(),
            details: `Some images are not reviewed`
        }));
    }

    return TE.right({
        ...imageRequest,
        status: ImageRequestStatus.COMPLETED
    });
}




export const ImageRequest = {
    create,
    toDto,
    addImage,
    addImages,
    setPrompt,
    canGenerateImage,
    generateImageUrl,
    review
}

