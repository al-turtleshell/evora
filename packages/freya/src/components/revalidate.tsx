'use client'
import revalidatePath from '@/server-actions/revalidatePath';
import React, { useEffect } from 'react';
type Props = {
    revalidateFn: () => void
}
export default function Revalidate({ revalidateFn }: Props) {
    useEffect(() => {
        const interval = setInterval(() => {
            revalidateFn();
        }, 10000); // 10000 ms = 10 seconds
    
        return () => clearInterval(interval);
      }, []);
    
    return null
}