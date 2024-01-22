"use server"

import { listImageRequestUsecase } from "@turtleshell/asgard";
import { Miscue } from "@turtleshell/daedelium";
import { ImageRequestRepository, createStorageService } from "@turtleshell/heracles";

import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";

import * as t from 'io-ts';
import { safeAction } from "@/lib/safe-action";
import { ImageRequestStatusEnum } from "@turtleshell/asgard/src/aggregate/image-request/enums";
import { ImageRequestDto } from "@turtleshell/asgard/build/aggregate/image-request/dtos";
import { getS3Client } from "@turtleshell/heracles/src/clients/s3.client";
import { loadConfiguration } from "@turtleshell/heracles";

const schema = t.partial({
    limit: t.number,
    status: t.array(ImageRequestStatusEnum),
    skip: t.number
})



export default safeAction<ImageRequestDto[]>()(schema, (data): TE.TaskEither<Miscue, ImageRequestDto[]> => {
    return pipe(
        TE.bindTo('s3client')(TE.fromEither(getS3Client())),
        TE.bind('configuration', () => loadConfiguration()),
        TE.bind('storageService', ({ s3client, configuration }) => TE.of(
            createStorageService(s3client, configuration.bucketName, configuration.imageFolder))
        ),

        TE.bind('imageRequestsDtos', ({ storageService }) => 
            //@ts-ignore
            listImageRequestUsecase({ getAll: ImageRequestRepository.getAll, createPresignedUrl: storageService.createPresignedUrl })(data)
        ),
        TE.map(({ imageRequestsDtos }) => imageRequestsDtos)
    )
});
