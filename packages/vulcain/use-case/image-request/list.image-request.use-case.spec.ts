import * as TE from 'fp-ts/lib/TaskEither';
import { v4 as uuid } from 'uuid';
import { listImageRequestUsecase } from '@turtleshell/asgard/build/use-case/image-request/list.image-request.use-case';
import { pipe } from "fp-ts/lib/function";
import { Miscue } from "@turtleshell/daedelium";
import { ImageRequestDto } from '@turtleshell/asgard/build/aggregate/image-request/dtos';

const getAllFn = (): TE.TaskEither<Miscue, ImageRequestDto[]> => {
    return TE.right([{
        id: uuid(),
        prompt: 'prompt',
        images: [],
        status: 'pending',
        numberOfImages: 4,
        style: 'black_and_white_illustration',
        description: 'description',
    }]);
}

const getAllFnEmpty = (): TE.TaskEither<Miscue, ImageRequestDto[]> => {
    return TE.right([]);
}


describe('Use case error path', () => {
    
});

describe('Use case success path', () => {
    it('should return a list of image requests', async () => {
        pipe(
            listImageRequestUsecase({ getAll: getAllFn })({}),
            TE.map((data) => {
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                expect(data[0].id).toBeDefined();
            }),
        )()
    });
    it('should return a empty list of image requests', async () => {
        pipe(
            listImageRequestUsecase({ getAll: getAllFnEmpty })({}),
            TE.map((data) => {
                expect(data).toBeDefined();
                expect(data.length).toBe(0);
            }),
        )()
    });
});