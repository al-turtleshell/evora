import * as t from 'io-ts';

export enum ImageRequestStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    TO_REVIEW = 'to_review',
    COMPLETED = 'completed'
}

export const ImageRequestStatusEnum = t.keyof({
    pending: null,
    in_progress: null,
    to_review: null,
    completed: null
});


export enum ImageStyle {
    BLACK_AND_WHITE_ILLUSTRATION = 'black_and_white_illustration',
}

export const ImageStyleEnum = t.keyof({
    black_and_white_illustration: null,
});


export enum ImageStatus {
    GENERATED = 'generated',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export const ImageStatusEnum = t.keyof({
    generated: null,
    accepted: null,
    rejected: null,
});