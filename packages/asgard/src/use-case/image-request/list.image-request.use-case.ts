import { pipe } from "fp-ts/lib/function";


import * as TE from 'fp-ts/lib/TaskEither';

import * as t from 'io-ts';
import { Miscue, decode } from "@turtleshell/daedelium";
import { ImageRequestStatusEnum } from "../../aggregate/image-request/enums";
import { ImageRequestDto } from "../../aggregate/image-request/dtos";

type Context = {
    getAll: ({ limit, status, skip }: Params) => TE.TaskEither<Miscue, ImageRequestDto[]>;
}

const schema = t.partial({
    limit: t.number,
    status: ImageRequestStatusEnum,
    skip: t.number,
});

type Params = t.TypeOf<typeof schema>;

export const listImageRequestUsecase = ({ getAll }: Context) => (params: Params): TE.TaskEither<Miscue, ImageRequestDto[]> => {
    return pipe(
        decode(schema, params),
        TE.fromEither,
        TE.chain(getAll)
    )
};