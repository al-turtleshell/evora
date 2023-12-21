import { Either } from "fp-ts/lib/Either";
import { Miscue } from "./miscue";
import * as t from 'io-ts';
export declare const decode: <T, O, I>(codec: t.Type<T, O, I>, input: any, miscue?: ((details?: string) => Miscue) | undefined) => Either<{
    code: "ir-0000" | "ir-0001" | "ir-0002" | "i-0000" | "1000" | "1001" | "1002" | "1003" | "1004" | "1005" | "cm-0000" | "cm-0001";
    message: string;
    timestamp: number;
    stack: string;
} & {
    details?: string | undefined;
}, T>;
//# sourceMappingURL=utils.d.ts.map