import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue } from "@turtleshell/daedelium";
import { ImageRequestDto } from "../../aggregate/image-request/dtos";
type Context = {
    getById: (imageRequestId: string) => TE.TaskEither<Miscue, ImageRequestDto>;
    save: (data: ImageRequestDto) => TE.TaskEither<Miscue, ImageRequestDto>;
    generateImage: (prompt: string) => TE.TaskEither<Miscue, string[]>;
};
export declare const generateImageImageRequestUsecase: ({ getById, generateImage, save }: Context) => (imageRequestId: string) => TE.TaskEither<Miscue, ImageRequestDto>;
export {};
//# sourceMappingURL=generate-image.image-request.use-case.d.ts.map