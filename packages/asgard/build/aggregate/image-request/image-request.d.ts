import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue } from '@turtleshell/daedelium';
export declare enum ImageRequestStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    TO_REVIEW = "to_review",
    COMPLETED = "completed"
}
export declare const ImageRequestStatusEnum: t.KeyofC<{
    pending: null;
    in_progress: null;
    to_review: null;
    completed: null;
}>;
export declare const CreateImageRequestDto: t.IntersectionC<[t.TypeC<{
    numberOfImages: t.NumberC;
    style: t.StringC;
    description: t.StringC;
}>, t.PartialC<{
    id: t.StringC;
    status: t.StringC;
    prompt: t.StringC;
    images: t.ArrayC<t.PartialC<{
        id: t.StringC;
        status: t.StringC;
    }>>;
}>]>;
export type CreateImageRequestDto = t.TypeOf<typeof CreateImageRequestDto>;
declare const ImageRequestDto: t.IntersectionC<[t.TypeC<{
    id: t.StringC;
    status: t.StringC;
    images: t.ArrayC<t.IntersectionC<[t.TypeC<{
        id: t.StringC;
        status: t.StringC;
    }>, t.PartialC<{
        url: t.StringC;
    }>]>>;
    numberOfImages: t.NumberC;
    style: t.StringC;
    description: t.StringC;
}>, t.PartialC<{
    prompt: t.StringC;
}>]>;
export type ImageRequestDto = t.TypeOf<typeof ImageRequestDto>;
declare const ImageRequestCodec: t.IntersectionC<[t.TypeC<{
    id: t.BrandC<t.StringC, import("@turtleshell/daedelium").UUIDBrand>;
    status: t.KeyofC<{
        pending: null;
        in_progress: null;
        to_review: null;
        completed: null;
    }>;
    images: t.ArrayC<t.IntersectionC<[t.TypeC<{
        id: t.BrandC<t.StringC, import("@turtleshell/daedelium").UUIDBrand>;
        status: t.KeyofC<{
            generated: null;
            accepted: null;
            rejected: null;
        }>;
    }>, t.PartialC<{
        url: t.StringC;
    }>]>>;
    numberOfImages: t.Type<number, number, unknown>;
    style: t.KeyofC<{
        black_and_white_illustration: null;
    }>;
    description: t.StringC;
}>, t.PartialC<{
    prompt: t.StringC;
}>]>;
export type ImageRequest = t.TypeOf<typeof ImageRequestCodec>;
export declare const ImageRequest: {
    create: ({ id, numberOfImages, style, description, images, prompt, status }: CreateImageRequestDto) => Either<Miscue, ImageRequest>;
    toDto: (imageRequest: ImageRequest) => ImageRequestDto;
    addImage: (imageRequest: ImageRequest, id: string) => Either<Miscue, ImageRequest>;
    addImages: (imageRequest: ImageRequest, ids: string[]) => Either<Miscue, ImageRequest>;
    setPrompt: (imageRequest: ImageRequest, prompt: string) => ImageRequest;
    canGenerateImage: (imageRequest: ImageRequest) => Either<Miscue, ImageRequest>;
    generateImageUrl: (imageRequest: ImageRequest, createPresignedUrl: (key: string) => TE.TaskEither<Miscue, string>) => TE.TaskEither<Miscue, ImageRequest>;
};
export {};
//# sourceMappingURL=image-request.d.ts.map