import { Client, TextChannel } from "discord.js-selfbot-v13";
import { MidjourneyChannelRepository } from "../data-access";
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";
import { Miscue, MiscueCode, retryAction, downloadImage, cutIntoQuadrant } from "@turtleshell/daedelium";
import fs from 'fs';
import { v4 as uuid } from 'uuid';


const selectChannel = (channels: TextChannel[], repository: MidjourneyChannelRepository) => (): TE.TaskEither<Miscue, TextChannel> => {
    return pipe(
        repository.getFreeChannel(),
        TE.map(channel => channels.find(chan => chan.id === channel.id) as TextChannel)
    )
}

const setChannelAsBusy = (repository: MidjourneyChannelRepository) => (channelId: string): TE.TaskEither<Miscue, unknown> => {
    return repository.setChannelAsBusy(channelId);
}

const setChannelAsFree = (repository: MidjourneyChannelRepository) => (channelId: string): TE.TaskEither<Miscue, unknown> => {
    return repository.setChannelAsFree(channelId);
}

const cleanUp = (path: string) => (preview_id: string, uuids: string[]): TE.TaskEither<Miscue, string[]> => {
    const paths = uuids.map(uuid => `./${path}/${uuid}.png`);
    paths.push(`./${path}/preview_${preview_id}.png`);

    return pipe(
      TE.sequenceArray(
        paths.map(path => 
          TE.tryCatch(
            () => fs.promises.unlink(path),
            () => 
                Miscue.create({
                    code: MiscueCode.IMAGE_GENERATION_SERVICE_CLEANUP_ERROR,
                    message: 'There was an issue while cleaning up',
                    timestamp: Date.now(),
                })
            )
          )
        ),
        TE.map(() => uuids)
      )
}

const sendImagineCommand = (midjourneyBotId: string) => (channel: TextChannel, prompt: string): TE.TaskEither<Miscue, unknown> => {
    return TE.tryCatch(
        async () => {
            await channel.sendSlash(midjourneyBotId, 'imagine', prompt);
        },
        () => Miscue.create({
            code: MiscueCode.IMAGE_GENERATION_SERVICE_CHANNEL_IMAGINE_COMMAND_ERROR,
            message: 'There was an issue while sending the imagine command',
            timestamp: Date.now(),
        })
    )
}


const generateImage = (
    selectChannel: () => TE.TaskEither<Miscue, TextChannel>,
    setChannelAsBusy: (channelId: string) => TE.TaskEither<Miscue, unknown>,
    sendImagineCommand: (channel: TextChannel, prompt: string) => TE.TaskEither<Miscue, unknown>,
    waitForImageCompletion: (channel: TextChannel) => TE.TaskEither<Miscue, string>,
    downloadImage: (url: string, filename: string) => TE.TaskEither<Miscue, unknown>,
    cutIntoQuadrant: (inputPath: string) => TE.TaskEither<Miscue, string[]>,
    storeImages: (paths: string[]) => TE.TaskEither<Miscue, string[]>,
    cleanUp: (preview_id: string, uuids: string[]) => TE.TaskEither<Miscue, string[]>,
    setChannelAsFree: (channelId: string) => TE.TaskEither<Miscue, unknown>,
) => (prompt: string): TE.TaskEither<Miscue, string[]> => {
    const id = uuid();
    return pipe(
        selectChannel(),
        TE.chain( channel => pipe(
            TE.bindTo('_1')(setChannelAsBusy(channel.id)),
            TE.bind('_2',               ()              => sendImagineCommand(channel, prompt)),
            TE.bind('url',              ()              => waitForImageCompletion(channel)),
            TE.bind('_3',               ({ url })       => downloadImage(url, `/preview_${id}.png`)),
            TE.bind('uuids',            ()              => cutIntoQuadrant(`./preview_${id}.png`)),
            TE.bind('_4',               ({ uuids })     => storeImages(uuids)),
            TE.bind('_5',               ({ uuids })     => cleanUp(id, uuids)),
            TE.bind('_6',               ()              => setChannelAsFree(channel.id)),
            TE.map(                     ({ uuids })     => uuids),
            TE.mapLeft(                 miscue          => { setChannelAsFree(channel.id)(); return miscue; })
        ))
    );
}

type ImageGenerationService = {
    generateImage: (prompt: string) => TE.TaskEither<Miscue, string[]>
}

export const createImageGenerationService = (
    discordClient: Client,
    storeImages: (paths: string[]) => TE.TaskEither<Miscue, string[]>,
    repository: MidjourneyChannelRepository,
    midjourneyBotId: string,
    path: string
): TE.TaskEither<Miscue, ImageGenerationService> => {
    return pipe(
        repository.getAllChannel(),
        TE.chain(channels => {
            return TE.sequenceArray(
                channels.map(channel => 
                    TE.tryCatch(
                        () => discordClient.channels.fetch(channel.id),
                        reason => 
                            Miscue.create({
                                code: MiscueCode.IMAGE_GENERATION_SERVICE_CHANNEL_FETCH_ERROR,
                                message: 'There was an issue while fetching a channel',
                                timestamp: Date.now(),
                                details: `There was an issue while fetching a channel ${reason}`
                            })
                        )
                    )
                ) as TE.TaskEither<Miscue, TextChannel[]>
        }),
        TE.map(channels => {
            const waitForImageCompletion = (channel: TextChannel) => pipe( 
                retryAction(
                    () => 
                        pipe(
                            TE.tryCatch(
                                () => channel.messages.fetch({ limit: 1 }),
                                () => Miscue.create({
                                    code: MiscueCode.MIDJOURNEY_CANNOT_FETCH_CHANNEL_MESSAGE,
                                    message: 'Cannot fetch channel message',
                                    timestamp: Date.now(),
                                })
                            ),
                            TE.map(messages => messages.first()?.attachments?.first()?.url),
                        )
                    ,
                    (url) => url !== undefined,
                    5,
                    15000,
                    'check image completion'
                ),
                TE.map(url => url as string)
            );
            
            return {
                generateImage: generateImage(
                    selectChannel(channels, repository),
                    setChannelAsBusy(repository),
                    sendImagineCommand(midjourneyBotId),
                    waitForImageCompletion,
                    downloadImage(path),
                    cutIntoQuadrant(path),
                    storeImages,
                    cleanUp(path),
                    setChannelAsFree(repository)
                )
            }
        })
    )
}