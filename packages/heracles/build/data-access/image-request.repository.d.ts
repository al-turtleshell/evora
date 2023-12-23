import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue } from "@turtleshell/daedelium";
import { ImageRequestDto } from "@turtleshell/asgard/build/aggregate/image-request/dtos";
import { ImageRequestStatus } from "@turtleshell/asgard/build/aggregate/image-request/enums";
type GetAllParams = {
    limit?: number;
    status?: ImageRequestStatus;
    skip?: number;
};
export declare const ImageRequestRepository: {
    save: (imageRequest: ImageRequestDto) => TE.TaskEither<Miscue, ImageRequestDto>;
    getById: (id: string) => TE.TaskEither<Miscue, ImageRequestDto>;
    getAll: ({ limit, status, skip }: GetAllParams) => TE.TaskEither<Miscue, ImageRequestDto[]>;
};
export type ImageRequestRepository = typeof ImageRequestRepository;
export {};
//# sourceMappingURL=image-request.repository.d.ts.map