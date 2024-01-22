"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ImageRequestDto } from "@turtleshell/asgard/build/aggregate/image-request/dtos"
import { ImageRequestProject, ImageRequestStatus } from "@turtleshell/asgard/src/aggregate/image-request/enums"
import { Eye } from "lucide-react"
import Link from "next/link"


export const columns: ColumnDef<ImageRequestDto>[] = [
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
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => {
      const project = row.getValue("project") as ImageRequestProject
      return <Badge variant="outline">{project.replaceAll('_', ' ')}</Badge>
  },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original
      if (request.status === ImageRequestStatus.COMPLETED) {
        return <div className="text-right italic text-muted-foreground"> Reviewed</div>
      }
      if (request.status !== ImageRequestStatus.TO_REVIEW) {
        return <div className="text-right italic text-muted-foreground"> Not ready to review</div>
      }
      return (
        <Link className="float-right" href={`./stocks/${row.original.id}/review`}>
          <Button variant='outline'><Eye className="w-4 h-4 mr-2"/>review</Button>
        </Link>
      )
    },
  },
]
