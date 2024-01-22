import { Image } from '@turtleshell/asgard'

import { ImageStatus } from '@turtleshell/asgard/build/aggregate/image-request/enums';
import { map } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { v4 as uuid } from 'uuid';

it('should create a new Image object with a generated UUID when no parameters are provided', () => {
    pipe(
        Image.create({}),
        map(image => {
            expect(image.id).toBeDefined();
            expect(image.status).toBeDefined();
        })
    )
});

it('should create a new Image object with provided UUID', () => {
    const id = uuid();
    pipe(
        Image.create({ id }),
        map(image => {
            expect(image.id).toBeDefined();
            expect(image.id).toBe(id);
            expect(image.status).toBeDefined();
        })
    )
});

it('should create a new Image object with provided status', () => {
    const status = ImageStatus.ACCEPTED;
    pipe(
        Image.create({ status }),
        map(image => {
            expect(image.id).toBeDefined();
            expect(image.status).toBeDefined();
            expect(image.status).toBe(status);
        })
    )
});

it('should create a DTO from an Image object', () => {
    const id = uuid();
    const status = ImageStatus.ACCEPTED;
    pipe(
        Image.create({ id, status }),
        map(image => {
            const dto = Image.toDto(image);
            expect(dto.id).toBe(id);
            expect(dto.status).toBe(status);
        })
    )
});

it('should add url to Image object', () => {
    const id = uuid();
    const status = ImageStatus.ACCEPTED;
    const url = 'https://www.google.com';
    pipe(
        Image.create({ id, status }),
        map(image => Image.addUrl(image, url)),
        map(image => {
            expect(image.id).toBe(id);
            expect(image.status).toBe(status);
            expect(image.url).toBe(url);

            return image;
        }),
        map(image => {
            const dto = Image.toDto(image);
            expect(dto.id).toBe(id);
            expect(dto.status).toBe(status);
            expect(dto.url).toBe(url);
        }),
    )
})