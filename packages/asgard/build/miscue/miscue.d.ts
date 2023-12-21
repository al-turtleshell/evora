import * as t from 'io-ts';
import { MiscueCode } from './miscue-code';
export declare const MiscueCodec: t.IntersectionC<[t.TypeC<{
    code: t.KeyofC<{
        'ir-0000': null;
        'ir-0001': null;
        'ir-0002': null;
        'i-0000': null;
        '1000': null;
        '1001': null;
        '1002': null;
        '1003': null;
        '1004': null;
        '1005': null;
        'cm-0000': null;
        'cm-0001': null;
    }>;
    message: t.StringC;
    timestamp: t.NumberC;
    stack: t.StringC;
}>, t.PartialC<{
    details: t.StringC;
}>]>;
export type Miscue = t.TypeOf<typeof MiscueCodec>;
type CreateParams = {
    code: MiscueCode;
    message: string;
    timestamp: number;
    details?: string;
};
export declare const Miscue: {
    create: ({ code, message, timestamp, details }: CreateParams) => Miscue;
};
export {};
//# sourceMappingURL=miscue.d.ts.map