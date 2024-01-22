"use server"
import { revalidatePath } from "next/cache"

export default async (path: string) => {
    revalidatePath('/backoffice/stocks');
}