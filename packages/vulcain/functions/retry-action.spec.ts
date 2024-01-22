import { Miscue, MiscueCode, retryAction } from '@turtleshell/daedelium';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

const actionFnFailed = (): TE.TaskEither<Miscue, string> => TE.left(Miscue.create({
    code: MiscueCode.VALIDATION_DATA_ERROR,
    message: 'Action failed',
    timestamp: Date.now(),
}));

const actionFnPending = (): TE.TaskEither<Miscue, string> => TE.right('Pending');
const actionFnSuccess = (): TE.TaskEither<Miscue, string> => TE.right('Success');

const conditionFn = (result: string): boolean => result === 'Success';


describe('retry action error path', () => {

    it('should return Miscue from action when action failed', async () => {
        await pipe(
            retryAction(actionFnFailed, conditionFn, 3, 1000, 'function name'),
            TE.mapLeft((e) => expect(e.code).toEqual(MiscueCode.VALIDATION_DATA_ERROR)),
            TE.map((result) => expect(result).toBeUndefined())
        )()
    });

    it('should return Miscue max retry attempt when attempt count is superior to max attemps', async () => {
        await pipe(
            retryAction(actionFnPending, conditionFn, 2, 500, 'function name'),
            TE.mapLeft((e) => expect(e.code).toEqual(MiscueCode.MAX_RETRIES_EXCEEDED_ERROR)),
            TE.map((result) => expect(result).toBeUndefined())
        )()
    });
});


describe('retry action success path', () => {
    it('should return action result', async () => {
        await pipe(
            retryAction(actionFnSuccess, conditionFn, 3, 1000, 'function name'),
            TE.map((result) => expect(result).toBe('Success')),
        )()
    });

});
