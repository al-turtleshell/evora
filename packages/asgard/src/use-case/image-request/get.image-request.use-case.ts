import { pipe } from "fp-ts/lib/function";
import { ImageRequest, ImageRequestDto } from "../../aggregate/image-request/image-request";
import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import { Miscue, decode } from "@turtleshell/daedelium";


type Context = {
    getById: (imageRequestId: string) => TE.TaskEither<Miscue, ImageRequestDto>;
    createPresignedUrl: (key: string) => TE.TaskEither<Miscue, string>;
}


export const getImageRequestUsecase = ({ getById, createPresignedUrl }: Context) => (imageRequestId: string): TE.TaskEither<Miscue, ImageRequestDto> => {
    return pipe(
        decode(t.string, imageRequestId),
        TE.fromEither,
        TE.chain(getById),
        TE.chainEitherK(ImageRequest.create),
        TE.chain(imageRequest => ImageRequest.generateImageUrl(imageRequest, createPresignedUrl)),
        TE.map(ImageRequest.toDto)
    )
}