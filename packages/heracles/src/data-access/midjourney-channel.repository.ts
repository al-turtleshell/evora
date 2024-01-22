import { getPrismaClient } from "../clients/prisma.client";
import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue, MiscueCode } from "@turtleshell/daedelium";
const prisma = getPrismaClient();


type MidjouneyChannel = {
    id: string;
    busy: boolean;
    name: string;
}
const getAllChannel = (): TE.TaskEither<Miscue, MidjouneyChannel[]>  => {
    return TE.tryCatch(
        async () => {
            const channels = await prisma.midjourneyChannel.findMany();

            return channels;
        },
        (e) => Miscue.create({
            code: MiscueCode.MIDJOURNEY_DATABASE_ERROR,
            message: 'There was an issue while getting the channels',
            timestamp: Date.now(),
            details: `There was an issue while getting the channels ${e}`
        })
    )
}

const getFreeChannel = (): TE.TaskEither<Miscue, MidjouneyChannel> => {
    return TE.tryCatch(
        async () => {
            const channel = await prisma.midjourneyChannel.findFirst({
                where: {
                    busy: false
                }
            });
            
            if (!channel) {
                throw new Error('No free channel found');
            }
    
            return channel;
        }, 
        (reason) => Miscue.create({
            code: MiscueCode.MIDJOURNEY_NO_FREE_CHANNEL_ERROR,
            message: 'There was an issue while getting a free channel',
            timestamp: Date.now(),
            details: `There was an issue while getting a free channel ${reason}`
        })
    )

}

const setChannelAsBusy = (channelId: string): TE.TaskEither<Miscue, unknown> => {
    return TE.tryCatch(
        async () => {
            await prisma.midjourneyChannel.update({
                where: {
                    id: channelId
                },
                data: {
                    busy: true
                }
            });
        },
        (reason) => Miscue.create({
            code: MiscueCode.MIDJOURNEY_DATABASE_ERROR,
            message: 'There was an issue while setting the channel as busy',
            timestamp: Date.now(),
            details: `There was an issue while setting the channel as busy ${reason}`
        })
    )
}

const setChannelAsFree = (channelId: string): TE.TaskEither<Miscue, unknown> => {
    return TE.tryCatch(
        async () => {
            await prisma.midjourneyChannel.update({
                where: {
                    id: channelId
                },
                data: {
                    busy: false
                }
            });
        },
        (reason) => Miscue.create({
            code: MiscueCode.MIDJOURNEY_DATABASE_ERROR,
            message: 'There was an issue while setting the channel as free',
            timestamp: Date.now(),
            details: `There was an issue while setting the channel as free ${reason}`
        })
    )
}

export const MidjourneyChannelRepository = {
    getAllChannel,
    getFreeChannel,
    setChannelAsBusy,
    setChannelAsFree
}

export type MidjourneyChannelRepository = typeof MidjourneyChannelRepository;