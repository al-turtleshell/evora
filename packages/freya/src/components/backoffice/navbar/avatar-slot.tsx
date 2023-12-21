import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LogOutItem from './logout-item';
import { Session } from 'next-auth';

type Props = {
    session: Session | null | undefined
}
export default function AvatarSlot({ session }: Props) {

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={session?.user.image} />
                        <AvatarFallback>{session?.user.lastname[0]}{session?.user.firstname[0]}</AvatarFallback>
                    </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' alignOffset={-10} sideOffset={10}>
                        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <LogOutItem />
                    </DropdownMenuContent>
                </DropdownMenu>
        </>
    )
}