import { S3 } from "@aws-sdk/client-s3";
export declare const storeImageS3: (s3: S3, bucketName: string, path: string) => (imageKey: string) => Promise<void>;
export declare const storeImagesS3: (s3: S3, bucketName: string, path: string) => (paths: string[]) => Promise<void>;
//# sourceMappingURL=store-image-s3.d.ts.map