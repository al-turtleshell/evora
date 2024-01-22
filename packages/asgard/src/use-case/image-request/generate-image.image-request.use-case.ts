import { pipe } from "fp-ts/lib/function";
import { ImageRequest,  } from "../../aggregate/image-request/image-request";
import * as TE from 'fp-ts/lib/TaskEither';

import * as t from 'io-ts';
import { Miscue, decode } from "@turtleshell/daedelium";
import { ImageRequestDto } from "../../aggregate/image-request/dtos";

type Context = {
    getById: (imageRequestId: string) => TE.TaskEither<Miscue, ImageRequestDto>;
    save: (data: ImageRequestDto) => TE.TaskEither<Miscue, ImageRequestDto>;
    generateImage: (prompt: string) => TE.TaskEither<Miscue, string[]>;
}


export const generateImageImageRequestUsecase = ({ getById, generateImage, save }: Context) => (imageRequestId: string): TE.TaskEither<Miscue, ImageRequestDto> => {
    return pipe(
        decode(t.string, imageRequestId),
        TE.fromEither,
        TE.chain(getById),
        TE.chainEitherK(ImageRequest.create),
        TE.chain(imageRequest => pipe(
            ImageRequest.canGenerateImage(imageRequest),
            TE.fromEither,
            TE.chain(imageRequest => pipe(
                (() => { 
                    return generateImage(imageRequest.prompt as string)
                })(),
                TE.chainEitherK(ids => ImageRequest.addImages(imageRequest, ids)),
            )),
        )),
        TE.chainEitherK(ImageRequest.toDto),
        TE.chain(save)
    )
};