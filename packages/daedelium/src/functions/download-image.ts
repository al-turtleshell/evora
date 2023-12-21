import { tryCatch, chain, TaskEither, map } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import axios from 'axios';
import fs from 'fs';
import { promisify } from 'util';
import { Miscue, MiscueCode } from '../miscue';
import { retryAction } from './retry-action';
import { checkFileAvailability } from './check-file-availability';

const writeFile = promisify(fs.writeFile);


const MiscueDownloadImageError = (details: string) => Miscue.create({
  code: MiscueCode.DOWNLOAD_IMAGE_ERROR,
  message: 'Download image error',
  timestamp: Date.now(),
  details
});

const MiscueWriteFileError = (details: string) => Miscue.create({
  code: MiscueCode.WRITE_FILE_ERROR,
  message: 'Write file error',
  timestamp: Date.now(),
  details
});


const download = (url: string): TaskEither<Miscue, Buffer> =>
  tryCatch(
    () => axios.get(url, { responseType: 'arraybuffer' })
             .then(response => Buffer.from(response.data, 'binary')),
    reason => MiscueDownloadImageError(String(reason))
  );


const writeToFile = (path: string, data: Buffer): TaskEither<Miscue, string> =>
  tryCatch(
    () => writeFile(path, data).then(() => path),
    reason => MiscueWriteFileError(String(reason))
  );


const waitForFileAvailability = (path: string) => pipe( 
    retryAction(
        () => checkFileAvailability(path),
        (r) => r === true,
        5,
        15000,
        'check file availability'
    ),
    map(() => path)
);

export const downloadImage = (basePath: string) => (url: string, filename: string): TaskEither<Miscue, string> =>
  pipe(
    download(url),
    chain(buffer => writeToFile(`${basePath}/${filename}`, buffer)),
    chain(waitForFileAvailability)
  );


