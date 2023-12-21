import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export const withAuth = (Component: React.FC, redirectOnLogged = false) => async (props: any) => {
    const session = await getServerSession(options);

    if (redirectOnLogged && session) {
        redirect('/')
    } 
    if (!redirectOnLogged && !session) {
        redirect('/login')
    }

    return <Component {...props} />
}