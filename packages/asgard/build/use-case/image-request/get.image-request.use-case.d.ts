import { ImageRequestDto } from "../../aggregate/image-request/image-request";
import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue } from "@turtleshell/daedelium";
type Context = {
    getById: (imageRequestId: string) => TE.TaskEither<Miscue, ImageRequestDto>;
    createPresignedUrl: (key: string) => TE.TaskEither<Miscue, string>;
};
export declare const getImageRequestUsecase: ({ getById, createPresignedUrl }: Context) => (imageRequestId: string) => TE.TaskEither<Miscue, ImageRequestDto>;
export {};
//# sourceMappingURL=get.image-request.use-case.d.ts.map