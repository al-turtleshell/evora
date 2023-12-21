import * as t from 'io-ts';
import { MiscueCode } from './miscue-code';
export declare const MiscueCodec: t.IntersectionC<[t.TypeC<{
    code: t.KeyofC<{
        'ir-0000': null;
        'ir-0001': null;
        'ir-0002': null;
        'ir-0003': null;
        'ir-0004': null;
        'i-0000': null;
        '1000': null;
        '1001': null;
        '1002': null;
        '1003': null;
        '1004': null;
        '1005': null;
        'cm-0000': null;
        'cm-0001': null;
        'cm-0002': null;
        'cm-0003': null;
        'cm-0004': null;
        'cm-0005': null;
        'cm-0006': null;
        'cm-0007': null;
        'cm-0008': null;
        'm-0000': null;
        'm-0001': null;
        'm-0002': null;
        'm-0003': null;
        'igs-0000': null;
        'igs-0001': null;
        'igs-0002': null;
        'fs-0000': null;
        'fs-0001': null;
        'a-0000': null;
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