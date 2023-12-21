'use client';

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import CreateImageRequestForm from './form';
import { Separator } from '@/components/ui/separator';

  
export default function CreateImageRequestButton() {
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">Generate image request</Button>
            </SheetTrigger>

            <SheetContent className="w-[400px] sm:w-[540px]" side={'left'}>
                <SheetHeader>
                    <SheetTitle>Image request</SheetTitle>
                </SheetHeader>
                <Separator className='mt-2 mb-4'/>
                <CreateImageRequestForm closeModal={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    )
}