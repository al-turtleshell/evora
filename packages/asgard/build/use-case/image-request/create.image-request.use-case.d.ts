import * as TE from "fp-ts/lib/TaskEither";
import { Miscue } from "@turtleshell/daedelium";
import { CreateImageRequestDto, ImageRequestDto } from "../../aggregate/image-request/dtos";
type Context = {
    save: (data: ImageRequestDto) => TE.TaskEither<Miscue, ImageRequestDto>;
    generatePrompt: (description: string, style: string) => TE.TaskEither<Miscue, string>;
};
export declare const createImageRequestUsecase: ({ save, generatePrompt }: Context) => (data: CreateImageRequestDto) => TE.TaskEither<Miscue, ImageRequestDto>;
export {};
//# sourceMappingURL=create.image-request.use-case.d.ts.map