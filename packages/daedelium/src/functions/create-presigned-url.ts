import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue, MiscueCode } from "../miscue";

type Context = {
    s3: S3
    bucket: string
}

export const createPresignedUrl = ({ s3, bucket }: Context) => ( key: string): TE.TaskEither<Miscue, string> => TE.tryCatch(
    () => {
        {
            const command = new PutObjectCommand({ Bucket: bucket, Key: key });
            return getSignedUrl(s3, command, { expiresIn: 18000 });
        };
    },
    (e) => Miscue.create({
        code: MiscueCode.S3_PRESIGNED_URL_GENERATION_ERROR,
        message: 'Cannot create presigned url',
        timestamp: Date.now(),
        details: `Cannot create presigned url for key ${key} in bucket ${bucket}`
    })
)
  