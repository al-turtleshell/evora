import { Miscue, get } from '@turtleshell/daedelium';
import dotenv from 'dotenv';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

dotenv.config();

export type HeraclesConfiguration = {

    imageFolder: string,
    midjourneyBotId: string,
    region: string,
    bucketName: string
}

export const loadConfiguration = (): TE.TaskEither<Miscue, HeraclesConfiguration> => {
    const env = get(process.env)
    return pipe(
        TE.bindTo('midjourneyBotId')(TE.fromEither(env<string>('DISCORD_MIDJOURNEY_BOT_ID'))),
        TE.bind('imageFolder',          () => TE.fromEither(env<string>('IMAGE_FOLDER'))),
        TE.bind('region',               () => TE.fromEither(env<string>('AWS_REGION'))),
        TE.bind('bucketName',           () => TE.fromEither(env<string>('AWS_S3_BUCKET_NAME'))),

        TE.map(({  midjourneyBotId, imageFolder, region, bucketName }) => ({
            midjourneyBotId,
            region,
            bucketName,
            imageFolder
        }))
    )
}