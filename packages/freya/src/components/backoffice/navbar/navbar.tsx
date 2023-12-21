import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import AvatarSlot from './avatar-slot';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
export default async function Navbar() {
    const session = await getServerSession(options)
    return (
        <div className='p-3 w-full border-b flex items-center'>
            <Link href='/' className='flex items-center'>
                <Image className='ml-[16px]' src={process.env.NEXT_PUBLIC_LOGO_URL || ''} alt='turtleshell logo' width={50} height={50} />
                <h1 className='ml-4 font-black text-2xl text-foreground'>TURTLESHELL</h1>
            </Link>
        
            <Link className='ml-[50px] uppercase font-bold text-foreground hover:text-muted-foreground' href='/backoffice'>Dashboard </Link>
            <Link className='ml-[25px] uppercase font-bold text-foreground hover:text-muted-foreground' href='/backoffice/stocks'>Stocks </Link>
            <div className='ml-auto mr-[15px] gap-8 outline-none flex items-center'>
                <AvatarSlot session={session} />
            </div>
        </div>
    )
}