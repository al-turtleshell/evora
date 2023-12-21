import { Miscue, MiscueCode, get } from "@turtleshell/daedelium";
import { Client } from "discord.js-selfbot-v13";
import dotenv from 'dotenv';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";

dotenv.config();

let discord: Client

export const getDiscordClient = (): TE.TaskEither<Miscue, Client> => {
    if (!discord) {
        return pipe(
            get(process.env)<string>('DISCORD_USER_TOKEN_ID'),
            TE.fromEither,
            TE.chain(token => TE.tryCatch(
                async () => {
                    discord = new Client({
                        checkUpdate: false,
                    })
                    
                    await discord.login(token);

                    return discord;
                },
                () => Miscue.create({
                    code: MiscueCode.MIDJOURNEY_CLIENT_ERROR,
                    message: 'There was an issue while getting the discord client',
                    timestamp: Date.now(),
                })
            ))
        )
    }

    return TE.of(discord);
}