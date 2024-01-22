import { pipe } from "fp-ts/lib/function";
import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import { Miscue, decode } from "@turtleshell/daedelium";
import { ImageRequestStatusEnum } from "../../aggregate/image-request/enums";
import { ImageRequestDto } from "../../aggregate/image-request/dtos";
import { ImageRequest } from "../../aggregate";

type Context = {
    getAll: ({ limit, status, skip }: Params) => TE.TaskEither<Miscue, ImageRequestDto[]>;
    createPresignedUrl?: (key: string) => TE.TaskEither<Miscue, string>
}

const schema = t.partial({
    limit: t.number,
    status: t.array(ImageRequestStatusEnum),
    skip: t.number,
});

type Params = t.TypeOf<typeof schema>;

export const listImageRequestUsecase = ({ getAll, createPresignedUrl }: Context) => (params: Params): TE.TaskEither<Miscue, ImageRequestDto[]> => {
    if (!createPresignedUrl) {
        return pipe(
            decode(schema, params),
            TE.fromEither,
            TE.chain(getAll),
        )  
    }
    
    return pipe(
        decode(schema, params),
        TE.fromEither,
        TE.chain(getAll),
        TE.chain(imageRequestDtos =>
            TE.traverseArray((imageRequestDto: ImageRequestDto) => pipe(
                TE.fromEither(ImageRequest.create(imageRequestDto)),
                TE.chain(imageRequest => ImageRequest.generateImageUrl(imageRequest, createPresignedUrl))
            )   
            )(imageRequestDtos),
        ),
        TE.chain(imageRequests => 
            TE.traverseArray((imageRequest: ImageRequest) => TE.fromEither(ImageRequest.toDto(imageRequest)))(imageRequests)    
        ),
        TE.map(imageRequestDtos => Array.from(imageRequestDtos))
    )
};