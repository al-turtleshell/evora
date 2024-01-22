import { S3 } from "@aws-sdk/client-s3";
import * as E from 'fp-ts/lib/Either';
import dotenv from 'dotenv';
import { pipe } from "fp-ts/lib/function";
import { Miscue, get } from "@turtleshell/daedelium";

dotenv.config();

let s3client: S3;

export const getS3Client = (): E.Either<Miscue, S3>  => {
    if (s3client) {
        return E.right(s3client);
    }

    const env = get(process.env);
    return pipe(
        E.bindTo('accessKeyId')(env<string>('AWS_ACCESS_KEY_ID')),
        E.bind('secretAccessKey', () => env<string>('AWS_SECRET_ACCESS_KEY')),
        E.bind('region', () => env<string>('AWS_REGION')),
        E.map(({ accessKeyId, secretAccessKey, region }) => { 
            s3client = new S3({
            credentials: {
                accessKeyId,
                secretAccessKey
            },
            region
        })

        return s3client;
    })
    )
}