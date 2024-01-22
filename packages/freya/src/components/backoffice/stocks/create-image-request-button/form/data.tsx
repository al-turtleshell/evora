import { ImageRequestProject } from '@turtleshell/asgard/src/aggregate/image-request/enums';
import { Miscue } from '@turtleshell/daedelium';

import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';


export enum ImageStyle {
    BLACK_AND_WHITE_ILLUSTRATION = "black_and_white_illustration",
}

import { z } from 'zod'

export const schema = z.object({
    description: z.string().refine((data) => {
        const keywords = data.split(';');
        return keywords.every(keyword => keyword.trim().length > 0);
      }, {
        message: "The string must consist of non-empty keywords separated by semicolons",
      }),
    style: z.nativeEnum(ImageStyle),
    numberOfImages: z.string().refine(value => parseInt(value) % 4 === 0, {
        message: "The number must be a multiple of 4",
      }),
    project: z.nativeEnum(ImageRequestProject)
})

export const defaultValues = {
    description: "",
    style: ImageStyle.BLACK_AND_WHITE_ILLUSTRATION,
    numberOfImages: '4',
    project: ImageRequestProject.ADOBE_STOCK
}


export type FormSchema = z.infer<typeof schema>;

type OnSubmitParams = {
    toast: (params: { description: string, variant?: "default" | "destructive" }) => void
    closeModal: () => void
    createImageRequest: (values: FormSchema) => Promise<E.Either<Miscue, string>>
}
export const onSubmit = ({toast, createImageRequest, closeModal }: OnSubmitParams) => async (values: FormSchema) => {
    const result = await createImageRequest(values);
    pipe(
        result,
        E.map((data) => {
            closeModal()
            toast({
                description: data,
            })
        }),
        E.mapLeft((miscue) => {
            console.log(miscue)
            closeModal()
            toast({
                description: miscue.message,
                variant: "destructive"
            })
        })
    )
}
