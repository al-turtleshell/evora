import { promises as fs } from 'fs';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Miscue, MiscueCode } from '../miscue';


export const checkFileAvailability = (path: string): TE.TaskEither<Miscue, boolean> => {
    return pipe(
        TE.tryCatch(
            () => fs.access(path, fs.constants.F_OK)
                .then(() => true)
                .catch((error) => {
                    if (error.code === 'ENOENT') {
                        return false;
                    }

                    throw error;
                }),
            (e) => Miscue.create({
                code: MiscueCode.FILE_ERROR,
                message: 'Error while checking file availability',
                timestamp: Date.now(),
                details: `${e}`
            })
        )
    );
};
