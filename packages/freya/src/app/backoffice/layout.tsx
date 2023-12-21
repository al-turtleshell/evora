import Navbar from "@/components/backoffice/navbar/navbar"
import { withAuth } from "@/components/with-auth"

export default function BackofficeLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
  }
  