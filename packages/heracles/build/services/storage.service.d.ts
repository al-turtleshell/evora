import { S3 } from "@aws-sdk/client-s3";
import { Miscue } from "@turtleshell/daedelium";
import * as TE from 'fp-ts/lib/TaskEither';
type StorageService = {
    createPresignedUrl: (key: string) => TE.TaskEither<Miscue, string>;
    storeImages: (imageKeys: string[]) => TE.TaskEither<Miscue, string[]>;
};
export declare const createStorageService: (s3: S3, bucketName: string, path: string) => StorageService;
export {};
//# sourceMappingURL=storage.service.d.ts.map