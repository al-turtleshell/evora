import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import fs from 'fs';

export const storeImageS3 = (s3: S3, bucketName: string, path: string) => async (imageKey: string): Promise<void> => {
    const data = fs.createReadStream(`${path}/${imageKey}.png`);

    const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: imageKey,
        Body: data
    });

    await s3.send(putCommand);
}   


export const storeImagesS3 = (s3: S3, bucketName: string, path: string) => async (paths: string[]) => {
    const storeImage = storeImageS3(s3, bucketName, path);

    await Promise.all(paths.map(storeImage));
}
