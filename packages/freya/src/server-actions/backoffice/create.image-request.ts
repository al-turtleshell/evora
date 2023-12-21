"use server"

import { authAction } from '@/lib/safe-action';
import { createImageRequestUsecase } from '@turtleshell/zeus';
import { z } from 'zod';
import { ImageRequestRepository } from '@turtleshell/heracles';
import { revalidatePath } from 'next/cache';


const predefinedStyle = [
    "black_and_white_illustration",
] as const;

const schema = z.object({
    numberOfImages: z.string().refine(n => parseInt(n) % 4 === 0, {
      message: "must be a multiple of 4",
    }).transform(n => parseInt(n)),
    description: z.string().min(5),
    style: z.enum(predefinedStyle),
});

export default authAction(schema, async (data, { user }) => {
    const save = ImageRequestRepository.save;
    const generatePrompt = async (description: string, style: string) => description;

    await createImageRequestUsecase({ save, generatePrompt })(data);

    revalidatePath('/backoffice/stocks')
    return 'Image request created successfully';
});

