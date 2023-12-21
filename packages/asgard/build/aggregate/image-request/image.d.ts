import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';
import { Miscue } from '@turtleshell/daedelium';
export declare enum ImageStyle {
    BLACK_AND_WHITE_ILLUSTRATION = "black_and_white_illustration"
}
export declare const ImageStyleEnum: t.KeyofC<{
    black_and_white_illustration: null;
}>;
export declare enum ImageStatus {
    GENERATED = "generated",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}
export declare const ImageStatusEnum: t.KeyofC<{
    generated: null;
    accepted: null;
    rejected: null;
}>;
export declare const ImageCodec: t.IntersectionC<[t.TypeC<{
    id: t.BrandC<t.StringC, import("@turtleshell/daedelium").UUIDBrand>;
    status: t.KeyofC<{
        generated: null;
        accepted: null;
        rejected: null;
    }>;
}>, t.PartialC<{
    url: t.StringC;
}>]>;
export declare const ImageDto: t.IntersectionC<[t.TypeC<{
    id: t.StringC;
    status: t.StringC;
}>, t.PartialC<{
    url: t.StringC;
}>]>;
export declare const CreateImageDto: t.PartialC<{
    id: t.StringC;
    status: t.StringC;
}>;
export type CreateImageDto = t.TypeOf<typeof CreateImageDto>;
export type ImageDto = t.TypeOf<typeof ImageDto>;
export type Image = t.TypeOf<typeof ImageCodec>;
export declare const Image: {
    create: ({ id, status }: CreateImageDto) => Either<Miscue, Image>;
    toDto: (image: Image) => ImageDto;
    addUrl: (image: Image, url: string) => Image;
};
//# sourceMappingURL=image.d.ts.map