import * as t from 'io-ts';
export interface UUIDBrand {
    readonly UUID: unique symbol;
}
export type UUID = t.Branded<string, UUIDBrand>;
export declare const UUID: t.BrandC<t.StringC, UUIDBrand>;
//# sourceMappingURL=uuid.d.ts.map