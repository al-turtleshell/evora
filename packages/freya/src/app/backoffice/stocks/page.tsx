import { withAuth } from '@/components/with-auth';
import listImageRequest from '@/server-actions/backoffice/list.image-request';

import React from 'react';
import CreateImageRequestButton from '@/components/backoffice/stocks/create-image-request-button';
import { DataTable } from '@/components/backoffice/stocks/request-table/data-table';
import { columns } from '@/components/backoffice/stocks/request-table/column';
import { pipe } from 'fp-ts/lib/function';
import { map, mapLeft } from 'fp-ts/lib/Either';

import Render from '@/components/render';
import Revalidate from '@/components/revalidate';
import revalidatePath from '@/server-actions/revalidatePath';

export const revalidate = 5;


const revalidateFn = async () => {
    "use server"
    revalidatePath('/backoffice/stocks')
}
async function StockPage() {
    const data = pipe (
        await listImageRequest({}),
        mapLeft(miscue => {
            return miscue;
        }),
        map(data => {
            return data;
        }),
    )
    
    return (
        <div>
            <Revalidate revalidateFn={revalidateFn} />
            <div className='m-4 flex gap-4'>
                <CreateImageRequestButton />
            </div>
                <Render 
                    data={data} 
                    renderSuccess={(data) => (
                        <div className='px-4'>
                            <DataTable columns={columns} data={data} />
                        </div>
                    )} 
                />          
        </div>
    )
}

export default withAuth(StockPage);