"use server"
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";

import * as t from 'io-ts';
import { safeAction } from "@/lib/safe-action";
import { ImageStyleEnum } from "@turtleshell/asgard/src/aggregate/image-request/enums";
import { createImageRequestUsecase } from "@turtleshell/asgard";
import { ImageRequestRepository } from "@turtleshell/heracles";
import { Miscue } from "@turtleshell/daedelium";
import { revalidatePath } from 'next/cache';


const schema = t.type({
    numberOfImages: t.string,
    description: t.string,
    style: ImageStyleEnum
})


export default safeAction<string>()(schema, (data): TE.TaskEither<Miscue, string> => {
    const save = ImageRequestRepository.save;
    const generatePrompt = (description: string, style: string) => TE.right(description);

    return pipe(
        createImageRequestUsecase({ save, generatePrompt })({
            ...data,
            numberOfImages: parseInt(data.numberOfImages, 10),
        }),
        TE.map(() => {
            revalidatePath('/stocks');
            return 'Image request created successfully'
        })
    )
})
