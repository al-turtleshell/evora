import { ImageRequestDto, ImageRequestStatus } from "@turtleshell/zeus";
import { getPrismaClient } from "../ clients/prisma.client";
import {  ImageStatus, ImageStyle } from "@prisma/client";

import * as TE from 'fp-ts/lib/TaskEither';
import { Miscue, MiscueCode } from "@turtleshell/daedelium";


const prisma = getPrismaClient();
const save = (imageRequest: ImageRequestDto): TE.TaskEither<Miscue, ImageRequestDto> => 
    TE.tryCatch(
         async () => {
            await prisma.$transaction(async (prisma) => {    
                const exist = await prisma.imageRequest.findUnique({
                    where: {
                        id: imageRequest.id
                    },
                    include: {
                        images: true
                    }
                });
            
                if (exist) {
                    await prisma.imageRequest.update({
                        where: {
                            id: imageRequest.id
                        },
                        data: {
                            numberOfImages: imageRequest.numberOfImages,
                            style: imageRequest.style as ImageStyle,
                            description: imageRequest.description,
                            prompt: imageRequest.prompt,
                            status: imageRequest.status as ImageRequestStatus
                        }
                    });

                    await prisma.image.createMany({
                        data: imageRequest.images.map(image => ({
                            id: image.id,
                            imageRequestId: imageRequest.id,
                            status: image.status as ImageStatus
                        }))
                    })

                    return;
                }
                
                await prisma.imageRequest.create({
                    data: {
                        id: imageRequest.id,
                        numberOfImages: imageRequest.numberOfImages,
                        style: imageRequest.style as ImageStyle,
                        description: imageRequest.description,
                        prompt: imageRequest.prompt,
                    }
                });
        
                await prisma.image.createMany({
                    data: imageRequest.images.map(image => ({
                        id: image.id,
                        imageRequestId: imageRequest.id,
                        status: image.status as ImageStatus
                    }))
                })
            })
            return imageRequest;
    }, (reason) => Miscue.create({
        code: MiscueCode.IMAGE_REQUEST_DATABASE_SAVE_ERROR,
        message: 'Image request creating failed',
        timestamp: Date.now(),
        details: `${reason}`
    }))

const getById = (id: string): TE.TaskEither<Miscue, ImageRequestDto> => {

    return TE.tryCatch(
        async () => {
            const imageRequest = await prisma.imageRequest.findUnique({
                where: {
                    id
                },
                include: {
                    images: true
                }
            });
        
            if (!imageRequest) {
                throw new Error('Image request not found');
            } 
            
            return imageRequest;
        },
        (reason) => Miscue.create({
            code: MiscueCode.IMAGE_REQUEST_NOT_FOUND_ERROR,
            message: 'Image request not found',
            timestamp: Date.now(),
            details: `Image request not found ${reason} for id ${id}`
        })
    )
}

type GetAllParams = {
    limit?: number,
    status?: ImageRequestStatus,
    skip?: number
}
const getAll = ({limit, status, skip}: GetAllParams): TE.TaskEither<Miscue, ImageRequestDto[]> => {
    return TE.tryCatch(
        async () => {
            return await prisma.imageRequest.findMany({
                include: {
                    images: true
                }, 
                where: {
                    status: status ?? undefined,
                },
                take: limit ?? undefined,
                skip: skip ?? 0
            });
        },
        (reason) => Miscue.create({
            code: MiscueCode.DATABASE_ERROR,
            message: 'Database error',
            timestamp: Date.now(),
            details: `Database error ${reason}`
        })
    )

}

export const ImageRequestRepository = {
    save,
    getById,
    getAll
}

export type ImageRequestRepository = typeof ImageRequestRepository;