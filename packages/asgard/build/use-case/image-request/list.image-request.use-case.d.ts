import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import { Miscue } from "@turtleshell/daedelium";
import { ImageRequestDto } from "../../aggregate/image-request/dtos";
type Context = {
    getAll: ({ limit, status, skip }: Params) => TE.TaskEither<Miscue, ImageRequestDto[]>;
};
declare const schema: t.PartialC<{
    limit: t.NumberC;
    status: t.KeyofC<{
        pending: null;
        in_progress: null;
        to_review: null;
        completed: null;
    }>;
    skip: t.NumberC;
}>;
type Params = t.TypeOf<typeof schema>;
export declare const listImageRequestUsecase: ({ getAll }: Context) => (params: Params) => TE.TaskEither<Miscue, ImageRequestDto[]>;
export {};
//# sourceMappingURL=list.image-request.use-case.d.ts.map