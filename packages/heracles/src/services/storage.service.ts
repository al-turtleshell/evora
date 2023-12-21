import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Miscue, MiscueCode } from "@turtleshell/daedelium";
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";
import fs from 'fs';

const createPresignedUrl = (s3: S3, bucket: string) => ( key: string): TE.TaskEither<Miscue, string> => TE.tryCatch(
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

const storeImage = (s3: S3, bucketName: string, path: string) => (imageKey: string): TE.TaskEither<Miscue, string> => {
    const data = fs.createReadStream(`${path}/${imageKey}.png`);

    const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: imageKey,
        Body: data
    });

    return pipe(
        TE.tryCatch(
            () => s3.send(putCommand),
            () => Miscue.create({
                code: MiscueCode.S3_UPLOAD_ERROR,
                message: 'Cannot upload image to S3',
                timestamp: Date.now(),
            })
        ),
        TE.map(() => imageKey)
    )
}   


type StorageService = {
    createPresignedUrl: (key: string) => TE.TaskEither<Miscue, string>
    storeImages: (imageKeys: string[]) => TE.TaskEither<Miscue, string[]>
}
export const createStorageService = (s3: S3, bucketName: string, path: string):  StorageService => { 
    const storeImages = (imageKeys: string[]): TE.TaskEither<Miscue, string[]> => {
        const storeImageS3 = storeImage(s3, bucketName, path);

        return pipe(TE.sequenceArray(imageKeys.map(storeImageS3)), TE.map((keys) => Array.from(keys)));
    }

    return {
        createPresignedUrl: createPresignedUrl(s3, bucketName),
        storeImages,
    }
}