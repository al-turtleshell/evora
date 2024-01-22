import * as t from 'io-ts';
import { ImageRequestProject } from './enums';

export const ImageDto = t.intersection([
    t.type({
        id: t.string,
        status: t.string,
    }),
    t.partial({
        url: t.string
    })
])

export type ImageDto = t.TypeOf<typeof ImageDto>;

export const CreateImageDto = t.partial({
    id: t.string,
    status: t.string
});

export type CreateImageDto = t.TypeOf<typeof CreateImageDto>;


export const CreateImageRequestDto = t.intersection([
    t.type({
        numberOfImages: t.number,
        style: t.string,
        description: t.string,
        project: t.string,
    }),
    t.partial({
        id: t.string,
        status: t.string,
        prompt: t.string,
        images: t.array(CreateImageDto),
    })
]);

export type CreateImageRequestDto = t.TypeOf<typeof CreateImageRequestDto>;

export const ImageRequestDto = 
    t.type({
        id: t.string,
        status: t.string,
        project: t.string,
        images: t.array(ImageDto),
        numberOfImages: t.number,
        style: t.string,
        description: t.string,
        prompt: t.string
    });


export type ImageRequestDto = t.TypeOf<typeof ImageRequestDto>;

