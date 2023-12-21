import { S3 } from "@aws-sdk/client-s3";
import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue } from "../miscue";
type Context = {
    s3: S3;
    bucket: string;
};
export declare const createPresignedUrl: ({ s3, bucket }: Context) => (key: string) => TE.TaskEither<Miscue, string>;
export {};
//# sourceMappingURL=create-presigned-url.d.ts.map