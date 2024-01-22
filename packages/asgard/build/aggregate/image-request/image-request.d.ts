import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue } from '@turtleshell/daedelium';
import { CreateImageRequestDto, ImageRequestDto } from './dtos';
declare const ImageRequestCodec: t.IntersectionC<[t.TypeC<{
    id: t.BrandC<t.StringC, import("@turtleshell/daedelium").UUIDBrand>;
    status: t.KeyofC<{
        pending: null;
        in_progress: null;
        to_review: null;
        completed: null;
    }>;
    project: t.KeyofC<{
        instagram: null;
        adobe_stock: null;
        yt_short: null;
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
    create: ({ id, numberOfImages, style, description, images, prompt, status, project }: CreateImageRequestDto) => Either<Miscue, ImageRequest>;
    toDto: (imageRequest: ImageRequest) => Either<Miscue, ImageRequestDto>;
    addImage: (imageRequest: ImageRequest, id: string) => Either<Miscue, ImageRequest>;
    addImages: (imageRequest: ImageRequest, ids: string[]) => Either<Miscue, ImageRequest>;
    setPrompt: (imageRequest: ImageRequest, prompt: string) => ImageRequest;
    canGenerateImage: (imageRequest: ImageRequest) => Either<Miscue, ImageRequest>;
    generateImageUrl: (imageRequest: ImageRequest, createPresignedUrl: (key: string) => TE.TaskEither<Miscue, string>) => TE.TaskEither<Miscue, ImageRequest>;
    review: (imageRequest: ImageRequest) => TE.TaskEither<Miscue, ImageRequest>;
};
export {};
//# sourceMappingURL=image-request.d.ts.map