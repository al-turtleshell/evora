import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue } from "@turtleshell/daedelium";
import { ImageRequestDto } from "../../aggregate/image-request/dtos";
type Context = {
    getById: (imageRequestId: string) => TE.TaskEither<Miscue, ImageRequestDto>;
    createPresignedUrl: (key: string) => TE.TaskEither<Miscue, string>;
};
export declare const getImageRequestUsecase: ({ getById, createPresignedUrl }: Context) => (imageRequestId: string) => TE.TaskEither<Miscue, ImageRequestDto>;
export {};
//# sourceMappingURL=get.image-request.use-case.d.ts.map