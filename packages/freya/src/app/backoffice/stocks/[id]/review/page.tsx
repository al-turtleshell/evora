import getImageRequest from '@/server-actions/backoffice/get.image-request';
import { pipe } from 'fp-ts/lib/function';
import { mapLeft, map } from 'fp-ts/lib/Either';
import React from 'react';
import Render from '@/components/render';
import Reviewer from '@/components/backoffice/stocks/review/reviewer';

type Props = {
    params: {
        id: string
    }
}
export default async function Review({params}: Props ) {
    const data = pipe(
        await getImageRequest(params.id),
        map(data => {
            console.log(data)
            return data;
        }),
        mapLeft(miscue => {
            console.log(miscue)
            return miscue;
        })
    )
    return (
        <div>
            <Render data={data} renderSuccess={(data) => (
                <Reviewer imageRequestDto={data} />
            )} />
        </div>
    )
}