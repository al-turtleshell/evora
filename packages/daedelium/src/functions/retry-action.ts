import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Miscue, MiscueCode } from '../miscue';


const miscueMaxRetries = (functionName: string) => Miscue.create({
    code: MiscueCode.MAX_RETRIES_EXCEEDED_ERROR,
    message: 'Max retries exceeded',
    timestamp: Date.now(),
    details: `Max retries exceeded for function ${functionName}`
})

export const retryAction = <T>(
    action: () => TE.TaskEither<Miscue, T>,
    condition: (result: T) => boolean,
    maxAttempts: number,
    interval: number,
    functionName: string,
    attemptCount = 0
): TE.TaskEither<Miscue, T> => {
    return pipe(
        action(),
        TE.chain(result =>
            condition(result) ? TE.right(result) :
            attemptCount >= maxAttempts ? TE.left(miscueMaxRetries(functionName)) :
            pipe(
                TE.rightTask(() => new Promise(resolve => setTimeout(resolve, interval))),
                TE.chain(() => retryAction(action, condition, maxAttempts, interval, functionName, attemptCount + 1))
            )
        )
    );
};