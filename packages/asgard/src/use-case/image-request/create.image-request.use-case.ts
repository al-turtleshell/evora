import * as TE from "fp-ts/lib/TaskEither";
import * as E from 'fp-ts/lib/Either';
import { ImageRequest } from "../../aggregate/image-request/image-request";
import { pipe } from "fp-ts/lib/function";
import { Miscue, decode } from "@turtleshell/daedelium";
import { CreateImageRequestDto, ImageRequestDto } from "../../aggregate/image-request/dtos";

type Context = {
    save: (data: ImageRequestDto) => TE.TaskEither<Miscue, ImageRequestDto>;
    generatePrompt: (description: string, style: string) => TE.TaskEither<Miscue, string>;
}

export const createImageRequestUsecase = ({ save, generatePrompt }: Context) => (data: CreateImageRequestDto): TE.TaskEither<Miscue, ImageRequestDto> => {
    return pipe(
        decode(CreateImageRequestDto, data),
        E.chain(dto => ImageRequest.create(dto)),
        TE.fromEither,
        TE.chain(imageRequest => pipe(
            generatePrompt(imageRequest.description, imageRequest.style),
            TE.map(prompt => ImageRequest.setPrompt(imageRequest, prompt))
        )),
        TE.chainEitherK(ImageRequest.toDto),
        TE.chain(save)
    )
}

// export const createImageRequestUsecase = ({ save, generatePrompt }: Context) => (data: CreateImageRequestDto): TE.TaskEither<Miscue, ImageRequestDto> => {
//     return pipe(
//         TE.bindTo("createImageDto")(TE.fromEither(decode(CreateImageRequestDto, data))),
//         TE.bind("imageRequest", ({ createImageDto }) => TE.fromEither(ImageRequest.create(createImageDto))),
//         TE.bind("prompt", ({ imageRequest }) => generatePrompt(imageRequest.description, imageRequest.style)),
//         TE.bind("imageRequestWithPrompt", ({ imageRequest, prompt }) => TE.of(ImageRequest.setPrompt(imageRequest, prompt))),
//         TE.map(({ imageRequestWithPrompt }) => ImageRequest.toDto(imageRequestWithPrompt)),

//     )
// }