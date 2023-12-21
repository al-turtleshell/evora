import * as E from 'fp-ts/lib/Either';
import { Miscue, MiscueCode } from "../miscue";

export const get = (values: Record<string, unknown>) => <T>(key: string): E.Either<Miscue, T> => {
    const value = values[key] as unknown as T | undefined;

    if (!value) {
        return E.left(Miscue.create({
            code: MiscueCode.CANNOT_GET_ENV_VARIABLE,
            message: 'Cannot get env variable',
            timestamp: Date.now(),
            details: `Value for key ${key} is undefined`
        }));
    }

    return E.right(value) as E.Either<Miscue, T>;
}