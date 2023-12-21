import { Client } from "discord.js-selfbot-v13";
import { MidjourneyChannelRepository } from "../data-access";
import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue } from "@turtleshell/daedelium";
type ImageGenerationService = {
    generateImage: (prompt: string) => TE.TaskEither<Miscue, string[]>;
};
export declare const createImageGenerationService: (discordClient: Client, storeImages: (paths: string[]) => TE.TaskEither<Miscue, string[]>, repository: MidjourneyChannelRepository, midjourneyBotId: string, path: string) => TE.TaskEither<Miscue, ImageGenerationService>;
export {};
//# sourceMappingURL=image-generation.service.d.ts.map