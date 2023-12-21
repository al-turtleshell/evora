import { S3 } from "@aws-sdk/client-s3";
import * as E from 'fp-ts/lib/Either';
import { Miscue } from "@turtleshell/daedelium";
export declare const getS3Client: () => E.Either<Miscue, S3>;
//# sourceMappingURL=s3.client.d.ts.map