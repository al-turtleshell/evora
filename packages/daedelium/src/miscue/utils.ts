import { Either, right, fold, left } from "fp-ts/lib/Either";
import { Miscue } from "./miscue";
import { pipe } from "fp-ts/lib/function";

import { MiscueCode } from "./miscue-code";
import * as t from 'io-ts';
import reporter from 'io-ts-reporters'

export const decode = <T, O, I>(codec: t.Type<T, O, I>, input: any, miscue?: (details?: string) => Miscue): Either<Miscue, T> => {
    return pipe(
        codec.decode(input),
        fold(
            // On failure, return a Miscue with error details
            errors => left<Miscue, T>(miscue ? miscue(reporter.report(left(errors)).join('\n')) : Miscue.create({
                code: MiscueCode.VALIDATION_DATA_ERROR,
                message: 'Validation failed',
                timestamp: Date.now(),
                details: reporter.report(left(errors)).join('\n')
            })),
            // On success, return the decoded data
            right
        )
    );

}
