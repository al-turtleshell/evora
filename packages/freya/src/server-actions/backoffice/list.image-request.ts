"use server"

import { ImageRequestDto, ImageRequestStatus, ImageRequestStatusEnum, listImageRequestUsecase } from "@turtleshell/asgard";
import { Miscue, MiscueCode, decode } from "@turtleshell/daedelium";
import { ImageRequestRepository } from "@turtleshell/heracles";
import { Either } from "fp-ts/lib/Either";
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";
import { z } from "zod";
import * as t from 'io-ts';
import { safeAction } from "@/lib/safe-action";

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
