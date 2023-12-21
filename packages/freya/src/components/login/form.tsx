'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { DisplayError } from './display-error';
import { MotionDiv } from '../motion/motion-div';


const formSchema = z.object({
    email: z.string().email({ message: 'e-mail invalid' }),
    password: z.string().min(3, { message: 'password invalid' })
});

type FormSchema= z.infer<typeof formSchema>;

const formInitialValues: FormSchema = {
    email: '',
    password: ''
};

type OnSubmitContext = {
    push: (path: string) => void;
    displayError: (message: string, show: boolean) => void;
}
const onSubmit = ({ push, displayError }: OnSubmitContext) => async (values: FormSchema) => {
    displayError('', false);

    const result = await signIn('credentials', { 
        email: values.email,
        password: values.password,
        redirect: false
    });

    if (!result || !result.ok) {
        displayError('Invalid credentials', true);
    } else {
        push('/')
    }
} 
 
const displayError = (setShowError: ({show, message}: { show: boolean, message: string}) => void) => (message: string, show: boolean) => {
    setShowError({ show, message });
}

export function LoginForm() {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: formInitialValues
    })
    const router = useRouter();
    const [showError, setShowError] = React.useState({ show: false, message: '' });


    return (
        <div className='flex flex-col relative'>
            <DisplayError {...showError} />
            <Card className='w-[450px]'>
                <CardHeader>
                    <CardTitle className='flex justify-center'>
                        <Image src={process.env.NEXT_PUBLIC_LOGO_URL || ''} alt='turtleshell logo' width={100} height={100} priority={true} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit({ push: router.push, displayError: displayError(setShowError)}))} className="w-full space-y-6" onFocus={() => setShowError({ show: false, message: ''})}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Adresse e-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e-mail" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex justify-center'>
                                <Button type="submit">Login</Button>
                            </div>
                            
                        </form>
                    </Form>

                </CardContent>
                </Card>
            </div>
    )
}
