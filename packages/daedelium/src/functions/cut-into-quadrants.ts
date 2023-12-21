import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { Miscue, MiscueCode } from '../miscue';

export const cutIntoQuadrant = (folderPath: string) => (filename: string): TE.TaskEither<Miscue, string[]> => {
  const inputPath = `${folderPath}/${filename}`;
  const extractAndSaveQuadrant = (inputPath: string, outputPath: string, quadrantWidth: number, quadrantHeight: number, i: number, j: number, uuid: string): TE.TaskEither<Miscue, unknown> =>  
    TE.tryCatch(
        () => sharp(inputPath)
                .extract({
                left: i * quadrantWidth,
                top: j * quadrantHeight,
                width: quadrantWidth,
                height: quadrantHeight
                })
                .toFile(`${outputPath}/${uuid}.png`),
        (reason) => Miscue.create({
            code: MiscueCode.CUT_INTO_QUADRANT_ERROR,
            message: 'Cannot cut into quadrant',
            timestamp: Date.now(),
            details: `${reason}`
        })
    )

    return pipe(
        TE.tryCatch(
          () => sharp(inputPath).metadata(),
          (reason) => (Miscue.create({
            code: MiscueCode.CUT_INTO_QUADRANT_ERROR,
            message: 'Cannot cut into quadrant',
            timestamp: Date.now(),
            details: `Cannot get metadata for ${inputPath} ${reason}`
          }))
        ),
        TE.chain(({ width, height }) =>
          width && height ? TE.right({ width, height }) : TE.left(Miscue.create({
            code: MiscueCode.CUT_INTO_QUADRANT_ERROR,
            message: 'Cannot cut into quadrant',
            timestamp: Date.now(),
            details: `Cannot get metadata for ${inputPath}`
          })
        )),
        TE.chain(({width, height}) => {
          const quadrantWidth = Math.floor(width / 2);
          const quadrantHeight = Math.floor(height / 2);
          const uuids = [uuid(), uuid(), uuid(), uuid()];
    
          return pipe(
            TE.sequenceArray(
              uuids.flatMap((uuid, index) => {
                const i = Math.floor(index / 2);
                const j = index % 2;
                return extractAndSaveQuadrant(inputPath, folderPath, quadrantWidth, quadrantHeight, i, j, uuid);
              })
            ),
            TE.map(() => uuids)
          );
        })
      );
};