import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue } from "@turtleshell/daedelium";
type MidjouneyChannel = {
    id: string;
    busy: boolean;
    name: string;
};
export declare const MidjourneyChannelRepository: {
    getAllChannel: () => TE.TaskEither<Miscue, MidjouneyChannel[]>;
    getFreeChannel: () => TE.TaskEither<Miscue, MidjouneyChannel>;
    setChannelAsBusy: (channelId: string) => TE.TaskEither<Miscue, unknown>;
    setChannelAsFree: (channelId: string) => TE.TaskEither<Miscue, unknown>;
};
export type MidjourneyChannelRepository = typeof MidjourneyChannelRepository;
export {};
//# sourceMappingURL=midjourney-channel.repository.d.ts.map