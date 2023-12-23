import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';
import { v4 as uuid } from 'uuid';
import { Miscue, MiscueCode, UUID, decode  } from "@turtleshell/daedelium";
import { CreateImageDto, ImageDto } from './dtos';
import { ImageStatus, ImageStatusEnum } from './enums';
import { ImageCreatingErrorMiscue } from '../../miscue';




export const ImageCodec = t.intersection([
    t.type({
        id: UUID,
        status: ImageStatusEnum,
    }),
    t.partial({
        url: t.string
    })
])

export type Image = t.TypeOf<typeof ImageCodec>;

const create = ({ id, status }: CreateImageDto): Either<Miscue, Image> => {
    return decode(
        ImageCodec, 
        {id: id ?? uuid(), status: status ?? ImageStatus.GENERATED},
        ImageCreatingErrorMiscue
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