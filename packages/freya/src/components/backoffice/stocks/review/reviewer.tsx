'use client';
import { ImageRequestDto } from '@turtleshell/asgard/build/aggregate/image-request/dtos';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Check, Highlighter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ImageStatus } from '@turtleshell/asgard/src/aggregate/image-request/enums';
import reviewImageRequest from '@/server-actions/backoffice/review.image-request';
type Props = {
    imageRequestDto: ImageRequestDto
}
export default function Reviewer({ imageRequestDto }: Props ) {
    const [images, setImages] = useState(imageRequestDto.images);
    const [current, setCurrent] = useState(0);
    const [result, setResult] = useState([] as boolean[]);
    return (
        <>
        {current < images.length ?
            <div className='mt-4 flex'>
                <img src={images[current].url as string} alt='image' className='w-[800px] ml-4'/>
                <div>
                    <h1 className='leading-none text-xl font-bold m-4'> {imageRequestDto.prompt} </h1>
                    <Badge variant='outline' className='ml-4 mb-4'>{imageRequestDto.style}</Badge>

                    <div className='flex gap-2 ml-4'>
                        <Button 
                            variant='outline' 
                            onClick={() => {
                                setResult([...result, true])
                                if (current < images.length ) {
                                    setCurrent(current + 1);
                                }
                            }}
                        >
                            <Check className='w-4 h-4 text-green-500 mr-2' /> Accepted
                        </Button>
                        <Button 
                            variant='outline' 
                            onClick={() => {
                                setResult([...result, false])
                                if (current < images.length ) {
                                    setCurrent(current + 1);
                                }
                            }}
                        >
                            <X className='w-4 h-4 text-red-500 mr-2' /> Rejected
                        </Button>
                    </div>
                </div>
            </div> : 
            <div className='w-full mt-12 flex items-center justify-center'>
                <div>
                <div>
                    vous avez validé {result.filter(r => r).length} images sur {images.length} images.
                </div>
                <div className='flex justify-center mt-4'>
                    <Button 
                        variant={'outline'}
                        onClick={async () => {
                            const ir = {
                                ...imageRequestDto,
                                images: images.map((image, index) => {
                                    return {
                                    ...image,
                                        status: result[index] ? ImageStatus.ACCEPTED : ImageStatus.REJECTED
                                    }
                                })
                            }

                            await reviewImageRequest(ir);
                        }}
                    >
                      <Highlighter className='w-4 h-4 mr-2' />  Finish review </Button>
                </div>
            </div>
            </div>}
        </>
    )
}