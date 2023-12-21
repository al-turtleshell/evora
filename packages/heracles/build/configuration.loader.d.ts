import { Miscue } from '@turtleshell/daedelium';
import * as TE from 'fp-ts/lib/TaskEither';
export type HeraclesConfiguration = {
    imageFolder: string;
    midjourneyBotId: string;
    region: string;
    bucketName: string;
};
export declare const loadConfiguration: () => TE.TaskEither<Miscue, HeraclesConfiguration>;
//# sourceMappingURL=configuration.loader.d.ts.map