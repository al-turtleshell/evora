'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import createImageRequest from '@/server-actions/backoffice/create.image-request';
import { Button } from '@/components/ui/button';
import { FormSchema, defaultValues, onSubmit, schema } from './data';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ImageRequestProject, ImageStyle } from '@turtleshell/asgard/src/aggregate/image-request/enums';

type Props = {
    closeModal: () => void
}
export default function CreateImageRequestForm({ closeModal }: Props) {
    const form = useForm<FormSchema>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues
    });
    const {toast} = useToast();

    return (
        <>
          <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit({toast, createImageRequest, closeModal}))} className="w-full space-y-6">
            <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Style</FormLabel>
                    <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Style" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ImageStyle).map((style) => (
                                    <SelectItem key={style} value={style}>
                                        {style.replaceAll('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Style" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ImageRequestProject).map((style) => (
                                    <SelectItem key={style} value={style}>
                                        {style.replaceAll('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="description" {...field} value={field.value} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="numberOfImages"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Number of images</FormLabel>
                    <FormControl>
                        <Input type='number' placeholder="number" {...field} value={field.value} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className='flex justify-center'>
                <Button type="submit" disabled={form.formState.isSubmitting}>Generate</Button>
            </div>
            
        </form>
        </Form>
        </>
    );
}