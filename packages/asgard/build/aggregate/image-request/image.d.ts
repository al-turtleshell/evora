import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';
import { Miscue } from "@turtleshell/daedelium";
import { CreateImageDto, ImageDto } from './dtos';
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
export type Image = t.TypeOf<typeof ImageCodec>;
export declare const Image: {
    create: ({ id, status }: CreateImageDto) => Either<Miscue, Image>;
    toDto: (image: Image) => ImageDto;
    addUrl: (image: Image, url: string) => Image;
};
//# sourceMappingURL=image.d.ts.map