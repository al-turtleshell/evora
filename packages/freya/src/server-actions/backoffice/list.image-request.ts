"use server"

import { listImageRequestUsecase } from "@turtleshell/asgard";
import { Miscue } from "@turtleshell/daedelium";
import { ImageRequestRepository } from "@turtleshell/heracles";

import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";

import * as t from 'io-ts';
import { safeAction } from "@/lib/safe-action";
import { ImageRequestStatusEnum } from "@turtleshell/asgard/src/aggregate/image-request/enums";
import { ImageRequestDto } from "@turtleshell/asgard/build/aggregate/image-request/dtos";

const schema = t.partial({
    limit: t.number,
    status: ImageRequestStatusEnum,
    skip: t.number
})

type Params = t.TypeOf<typeof schema>;

export default safeAction<ImageRequestDto[]>()(schema, (data): TE.TaskEither<Miscue, ImageRequestDto[]> => {
    return pipe(
        //@ts-ignore
        listImageRequestUsecase({ getAll: ImageRequestRepository.getAll })(data),
    )
});
