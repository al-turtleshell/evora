
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
      })
})

export const defaultValues = {
    description: "",
    style: ImageStyle.BLACK_AND_WHITE_ILLUSTRATION,
    numberOfImages: '4'
}


export type FormSchema = z.infer<typeof schema>;

type OnSubmitParams = {
    toast: (params: { description: string, variant?: "default" | "destructive" }) => void
    closeModal: () => void
    createImageRequest: (values: FormSchema) => Promise<{
        serverError?: string
        data?: string
    }>

}
export const onSubmit = ({toast, closeModal, createImageRequest}: OnSubmitParams) => async (values: FormSchema) => {
    console.log(values)
    const result = await createImageRequest(values);

    if (result.serverError) {
        console.log(result.serverError)
        toast({
            description: result.serverError,
            variant: "destructive"
        })
    }

    if (result.data) {
        console.log(result.data)
        toast({
            description: result.data,
        })
    }
    closeModal()
}
