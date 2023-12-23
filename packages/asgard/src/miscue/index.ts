import { Miscue, MiscueCode } from "@turtleshell/daedelium";

export const PromptNotSetMiscue = (id: string) => Miscue.create({
    code: MiscueCode.IMAGE_REQUEST_PROMPT_NOT_SET,
    message: 'Prompt is undefined',
    timestamp: Date.now(),
    details: `Prompt is undefined for image request with id ${id}`
})

export const RequestInvalidStatusMiscue = (id: string, status: string) => Miscue.create({
    code: MiscueCode.IMAGE_REQUEST_INVALID_STATUS,
    message: 'Image request status is invalid',
    timestamp: Date.now(),
    details: `Image request with id ${id} has status ${status}`
})

export const ImageRequestCreatingErrorMiscue = (details?: string) => Miscue.create({
    code: MiscueCode.IMAGE_REQUEST_CREATING_ERROR,
    message: 'Image request creating failed',
    timestamp: Date.now(),
    details,
})

export const ImageCreatingErrorMiscue = (details?: string) => Miscue.create({
    code: MiscueCode.IMAGE_CREATTNG_ERROR,
    message: 'Image creating failed',
    timestamp: Date.now(),
    details,
})