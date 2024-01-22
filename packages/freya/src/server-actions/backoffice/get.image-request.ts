"use server"
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";

import * as t from 'io-ts';
import { safeAction } from "@/lib/safe-action";
import { getImageRequestUsecase } from "@turtleshell/asgard";
import { ImageRequestRepository, createStorageService } from "@turtleshell/heracles";
import { Miscue, UUID } from "@turtleshell/daedelium";
import { revalidatePath } from 'next/cache';
import { ImageRequestDto } from '@turtleshell/asgard/build/aggregate/image-request/dtos';
import { getS3Client } from '@turtleshell/heracles/src/clients/s3.client';
import { loadConfiguration } from "@turtleshell/heracles";



export default safeAction<ImageRequestDto>()(t.string, (data): TE.TaskEither<Miscue, ImageRequestDto> => {
    return pipe(
        TE.bindTo('s3client')(TE.fromEither(getS3Client())),
        TE.bind('configuration', () => loadConfiguration()),
        TE.bind('storageService', ({ s3client, configuration }) => TE.of(
            createStorageService(s3client, configuration.bucketName, configuration.imageFolder))
        ),

        TE.bind('imageRequestsDto', ({ storageService }) => 
            getImageRequestUsecase({ getById: ImageRequestRepository.getById, createPresignedUrl: storageService.createPresignedUrl })(data)
        ),
        TE.map(({ imageRequestsDto }) => imageRequestsDto)
    )
})
