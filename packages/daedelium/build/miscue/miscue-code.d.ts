import * as t from 'io-ts';
export declare const MiscueCodeEnum: t.KeyofC<{
    'ir-0000': null;
    'ir-0001': null;
    'ir-0002': null;
    'ir-0003': null;
    'ir-0004': null;
    'i-0000': null;
    '1000': null;
    '1001': null;
    '1002': null;
    '1003': null;
    '1004': null;
    '1005': null;
    'cm-0000': null;
    'cm-0001': null;
    'cm-0002': null;
    'cm-0003': null;
    'cm-0004': null;
    'cm-0005': null;
    'cm-0006': null;
    'cm-0007': null;
    'cm-0008': null;
    'm-0000': null;
    'm-0001': null;
    'm-0002': null;
    'm-0003': null;
    'igs-0000': null;
    'igs-0001': null;
    'igs-0002': null;
    'fs-0000': null;
    'fs-0001': null;
    'a-0000': null;
}>;
export declare enum MiscueCode {
    VALIDATION_DATA_ERROR = "1000",
    PROMPT_GENERATION_ERROR = "1001",
    DATABASE_ERROR = "1002",
    IMAGE_GENERATION_ERROR = "1003",
    DATABASE_NOT_FOUND_ERROR = "1004",
    AUTH_SESSION_NOT_FOUND_ERROR = "a-0000",
    FILE_ERROR = "fs-0000",
    FILE_ACCESS_ERROR = "fs-0001",
    DOWNLOAD_IMAGE_ERROR = "cm-0000",
    WRITE_FILE_ERROR = "cm-0001",
    RETRY_ACTION_ERROR = "cm-0002",
    MAX_RETRIES_EXCEEDED_ERROR = "cm-0003",
    CANNOT_GET_ENV_VARIABLE = "cm-0004",
    S3_PRESIGNED_URL_GENERATION_ERROR = "cm-0005",
    CUT_INTO_QUADRANT_ERROR = "cm-0006",
    S3_UPLOAD_ERROR = "cm-0007",
    LOAD_CONFIGURATION_ERROR = "cm-0008",
    IMAGE_REQUEST_CREATING_ERROR = "ir-0000",
    IMAGE_REQUEST_PROMPT_NOT_SET = "ir-0001",
    IMAGE_REQUEST_INVALID_STATUS = "ir-0002",
    IMAGE_REQUEST_DATABASE_SAVE_ERROR = "ir-0003",
    IMAGE_REQUEST_NOT_FOUND_ERROR = "ir-0004",
    IMAGE_CREATTNG_ERROR = "i-0000",
    MIDJOURNEY_CLIENT_ERROR = "m-0003",
    MIDJOURNEY_NO_FREE_CHANNEL_ERROR = "m-0000",
    MIDJOURNEY_DATABASE_ERROR = "m-0001",
    MIDJOURNEY_CANNOT_FETCH_CHANNEL_MESSAGE = "m-0002",
    IMAGE_GENERATION_SERVICE_CLEANUP_ERROR = "igs-0000",
    IMAGE_GENERATION_SERVICE_CHANNEL_FETCH_ERROR = "igs-0001",
    IMAGE_GENERATION_SERVICE_CHANNEL_IMAGINE_COMMAND_ERROR = "igs-0002"
}
//# sourceMappingURL=miscue-code.d.ts.map