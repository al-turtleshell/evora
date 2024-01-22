import * as TE from "fp-ts/lib/TaskEither";
import * as E from 'fp-ts/lib/Either';
import { ImageRequest } from "../../aggregate/image-request/image-request";
import { pipe } from "fp-ts/lib/function";
import { Miscue, decode } from "@turtleshell/daedelium";
import { ImageRequestDto } from "../../aggregate/image-request/dtos";

type Context = {
    save: (data: ImageRequestDto) => TE.TaskEither<Miscue, ImageRequestDto>;
}

export const reviewImageRequestUsecase = ({ save }: Context) => (data: ImageRequestDto): TE.TaskEither<Miscue, ImageRequestDto> => {
    return pipe(
        decode(ImageRequestDto, data),
        E.chain(dto => ImageRequest.create(dto)),
        TE.fromEither,
        TE.chain(ImageRequest.review),
        TE.chainEitherK(ImageRequest.toDto),
        TE.chain(save)
    )
}
