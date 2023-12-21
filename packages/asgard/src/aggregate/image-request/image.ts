import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';
import { v4 as uuid } from 'uuid';

import { Miscue, MiscueCode, UUID, decode } from '@turtleshell/daedelium';
export enum ImageStyle {
    BLACK_AND_WHITE_ILLUSTRATION = 'black_and_white_illustration',
}

export const ImageStyleEnum = t.keyof({
    black_and_white_illustration: null,
});

export enum ImageStatus {
    GENERATED = 'generated',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export const ImageStatusEnum = t.keyof({
    generated: null,
    accepted: null,
    rejected: null,
});

export const ImageCodec = t.intersection([
    t.type({
        id: UUID,
        status: ImageStatusEnum,
    }),
    t.partial({
        url: t.string
    })
])

export const ImageDto = t.intersection([
    t.type({
        id: t.string,
        status: t.string,
    }),
    t.partial({
        url: t.string
    })
])


export const CreateImageDto = t.partial({
    id: t.string,
    status: t.string
});

export type CreateImageDto = t.TypeOf<typeof CreateImageDto>;
export type ImageDto = t.TypeOf<typeof ImageDto>;
export type Image = t.TypeOf<typeof ImageCodec>;


const create = ({ id, status }: CreateImageDto): Either<Miscue, Image> => {
    return decode(
        ImageCodec, 
        {id: id ?? uuid(), status: status ?? ImageStatus.GENERATED},
        (details?: string) => Miscue.create({
            code: MiscueCode.IMAGE_CREATTNG_ERROR,
            message: 'Image creating failed',
            timestamp: Date.now(),
            details,
        }),
    );
}

const toDto = (image: Image): ImageDto => {
    return {
        id: image.id,
        status: image.status,
        url: image.url,
    }
}

const addUrl = (image: Image, url: string): Image => {
    return {
        ...image,
        url,
    }
}

export const Image = {
    create,
    toDto,
    addUrl,
}