import * as t from 'io-ts';
import { MiscueCode, MiscueCodeEnum } from './miscue-code';

export const MiscueCodec = t.intersection([
    t.type({
        code: MiscueCodeEnum,
        message: t.string,
        timestamp: t.number,
        stack: t.string,
    }),
    t.partial({
        details: t.string
    })
]) 

export type Miscue = t.TypeOf<typeof MiscueCodec>;


type CreateParams = {
    code: MiscueCode,
    message: string,
    timestamp: number,
    details?: string,
}

const create = ({ code, message, timestamp, details }: CreateParams): Miscue => ({
        code,
        message,
        timestamp,
        stack: new Error().stack ?? '',
        details,
    })

export const Miscue = {
    create,
}