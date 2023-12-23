import { pipe } from "fp-ts/lib/function"
import { ImageRequestRepository, MidjourneyChannelRepository } from "../data-access"
import * as TE from 'fp-ts/lib/TaskEither';
import { loadConfiguration } from "../configuration.loader";
import { getDiscordClient } from "../ clients/discord.client";
import { getS3Client } from "../ clients/s3.client";
import { createImageGenerationService, createStorageService } from "../services";
import { generateImageImageRequestUsecase } from "@turtleshell/asgard";
import { ImageRequestStatus } from "@turtleshell/asgard/build/aggregate/image-request/enums";
import { Miscue, MiscueCode } from "@turtleshell/daedelium";
import cron from "node-cron";



const launch = () => {
    console.log('launching cron generating image')
    pipe(
        TE.bindTo("discordClient")(getDiscordClient()),
        TE.bind('s3client', () => TE.fromEither(getS3Client())),
        TE.bind('configuration', () => loadConfiguration()),
        TE.bind('storageService', ({ s3client, configuration }) => TE.of(
            createStorageService(s3client, configuration.bucketName, configuration.imageFolder))
        ),
        TE.bind('imageGenerationService', ({ discordClient, configuration, storageService}) => createImageGenerationService(
            discordClient, 
            storageService.storeImages, 
            MidjourneyChannelRepository,
            configuration.midjourneyBotId, 
            configuration.imageFolder
        )),
        TE.bind('imageRequestDtosInProgress', () => ImageRequestRepository.getAll({ limit: 10, status: ImageRequestStatus.IN_PROGRESS, skip: 0 })),
        TE.bind('imageRequestDtosPending', () => ImageRequestRepository.getAll({ limit: 10, status: ImageRequestStatus.PENDING, skip: 0 })),
        TE.bind('nextImageRequestDto', ({ imageRequestDtosInProgress, imageRequestDtosPending }) => {
            if (imageRequestDtosInProgress.length > 0) { 
                return TE.right(imageRequestDtosInProgress[0])
            }

            if (imageRequestDtosPending.length > 0) {
                return TE.right(imageRequestDtosPending[0])
            }
 
            return TE.left(Miscue.create({
                code: MiscueCode.IMAGE_REQUEST_CRON_NO_REQUEST_AVAILABLE,
                message: "No image request available",
                timestamp: Date.now()
            }))
        }),
        TE.bind('imageRequestDto', ({ imageGenerationService, nextImageRequestDto }) => generateImageImageRequestUsecase({
            getById: ImageRequestRepository.getById,
            save: ImageRequestRepository.save,
            generateImage: imageGenerationService.generateImage
        })(nextImageRequestDto.id)),
        TE.map(({ imageRequestDto }) => console.log(`Image request has been generated for ImageRequest id ${imageRequestDto.id}`)),
        TE.mapLeft(console.log)
    )()
    
}

cron.schedule('*/3 * * * *', () => {
    console.log('started');
    launch()
});

//launch();