
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withAuth } from '@/components/with-auth';

import listImageRequest from '@/server-actions/backoffice/list.image-request';

import React from 'react';


import CreateImageRequestButton from '@/components/backoffice/stocks/create-image-request-button';
import { DataTable } from '@/components/backoffice/stocks/request-table/data-table';
import { columns } from '@/components/backoffice/stocks/request-table/column';
import { pipe } from 'fp-ts/lib/function';
import { fold, map, mapLeft } from 'fp-ts/lib/Either';

async function StockPage() {

    const data = pipe (
        await listImageRequest({}),
        mapLeft(miscue => {
            console.log(miscue);
            //redirect('/backoffice')
            return miscue;
        }),
        map(data => data)
    )

    return (
        <div>
            <div className='m-4 flex gap-4'>
                <CreateImageRequestButton />
            </div>
            {
                pipe(
                    data,
                    map(data => { console.log(data); return data; }),
                    fold(
                        () => {

                            return <div>error</div>
                        },
                        (data) => (
                            <div className='px-4'>
                                <DataTable columns={columns} data={data} />
                            </div>
                            // <div></div>
                        )
                    ),
                )
            }
            {/*  */}

          
        </div>
    )
}

export default withAuth(StockPage);