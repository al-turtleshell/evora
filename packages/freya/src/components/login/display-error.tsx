import React from 'react';
import { Card } from '../ui/card';
import { AlertTriangle } from 'lucide-react';
import { MotionDiv } from '../motion/motion-div';
import { AnimatePresence } from 'framer-motion';

type Props = {
    show: boolean;
    message: string;
}
export function DisplayError({ show, message }: Props) {    
    return (
        <AnimatePresence>
           { show && <MotionDiv
                initial={{ y: '-5vh', opacity: 0 }} 
                exit={{ y: '-2vh', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}       
                transition={{ duration: 0.3, type: "tween"  }} 
                className='absolute top-[-80px] left-0 right-0 z-50'
            >
                <Card className='w-[450px] h-[75px] mb-2 bg-destructive-muted'>
                    <div className='flex items-center h-full p-5 leading-none text-destructive-foreground gap-2'>
                        <AlertTriangle className='w-5 h-5' />
                        <p className='text-sm '>{ message }</p>
                    </div>
                </Card>
            </MotionDiv> }
        </AnimatePresence>
    )
}