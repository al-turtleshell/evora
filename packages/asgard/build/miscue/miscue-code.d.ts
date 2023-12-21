import * as t from 'io-ts';
export declare const MiscueCodeEnum: t.KeyofC<{
    'ir-0000': null;
    'ir-0001': null;
    'ir-0002': null;
    'i-0000': null;
    '1000': null;
    '1001': null;
    '1002': null;
    '1003': null;
    '1004': null;
    '1005': null;
    'cm-0000': null;
    'cm-0001': null;
}>;
export declare enum MiscueCode {
    VALIDATION_DATA_ERROR = "1000",
    PROMPT_GENERATION_ERROR = "1001",
    DATABASE_SAVE_ERROR = "1002",
    IMAGE_GENERATION_ERROR = "1003",
    DATABASE_NOT_FOUND_ERROR = "1004",
    S3_PRESIGNED_GENERATION_ERROR = "1005",
    DOWNLOAD_IMAGE_ERROR = "cm-0000",
    WRITE_FILE_ERROR = "cm-0001",
    IMAGE_REQUEST_CREATING_ERROR = "ir-0000",
    IMAGE_REQUEST_PROMPT_NOT_SET = "ir-0001",
    IMAGE_REQUEST_INVALID_STATUS = "ir-0002",
    IMAGE_CREATTNG_ERROR = "i-0000"
}
//# sourceMappingURL=miscue-code.d.ts.map