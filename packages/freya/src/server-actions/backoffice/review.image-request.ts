"use server"
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";

import { safeAction } from "@/lib/safe-action";
import { reviewImageRequestUsecase } from "@turtleshell/asgard";
import { ImageRequestRepository } from "@turtleshell/heracles";
import { Miscue } from "@turtleshell/daedelium";
import { revalidatePath } from 'next/cache';
import { ImageRequestDto } from '@turtleshell/asgard/build/aggregate/image-request/dtos';
import { redirect } from 'next/navigation';




export default safeAction<string>()(ImageRequestDto, (data): TE.TaskEither<Miscue, string> => {
    const save = ImageRequestRepository.save;

    return pipe(
        reviewImageRequestUsecase({ save })(data),
        TE.map(() => {
            revalidatePath('/backoffice/stocks');
            redirect('/backoffice/stocks');
        })
    )
})
