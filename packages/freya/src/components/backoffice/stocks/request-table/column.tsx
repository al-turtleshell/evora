"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"


// this should be sync with @turtleshell/zeus image-request
export enum ImageRequestStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    TO_REVIEW = 'to_review',
    COMPLETED = 'completed'
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ImageRequest = {
  id: string
  description: string
  status: ImageRequestStatus,
  numberOfImages: number,
  images: string[],
}

export const columns: ColumnDef<ImageRequest>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as ImageRequestStatus
        return <Badge variant="outline">{status.replaceAll('_', ' ')}</Badge>
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "Progress",
    header: () => <div className="text-right">Progress</div>,
    cell: ({ row }) => {
        const numberOfImages = row.original.numberOfImages;
        const images = row.original.images.length;
       
        
      return <div className="text-right font-medium w-[150px] ml-auto">{images} / {numberOfImages}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original
 
      if (request.status !== ImageRequestStatus.TO_REVIEW) {
        return <div className="text-right italic text-muted-foreground"> Not ready to review</div>
      }
      return (
        <Link className="float-right" href={`./stocks/${row.original.id}/review`}>
          <Button variant='outline'>Review</Button>
        </Link>
      )
    },
  },
]
