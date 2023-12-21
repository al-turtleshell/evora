import { Either } from "fp-ts/lib/Either";
import { Miscue } from "./miscue";
import * as t from 'io-ts';
export declare const decode: <T, O, I>(codec: t.Type<T, O, I>, input: any, miscue?: ((details?: string) => Miscue) | undefined) => Either<{
    code: "ir-0000" | "ir-0001" | "ir-0002" | "ir-0003" | "ir-0004" | "i-0000" | "1000" | "1001" | "1002" | "1003" | "1004" | "1005" | "cm-0000" | "cm-0001" | "cm-0002" | "cm-0003" | "cm-0004" | "cm-0005" | "cm-0006" | "cm-0007" | "cm-0008" | "m-0000" | "m-0001" | "m-0002" | "m-0003" | "igs-0000" | "igs-0001" | "igs-0002" | "fs-0000" | "fs-0001" | "a-0000";
    message: string;
    timestamp: number;
    stack: string;
} & {
    details?: string | undefined;
}, T>;
//# sourceMappingURL=utils.d.ts.map