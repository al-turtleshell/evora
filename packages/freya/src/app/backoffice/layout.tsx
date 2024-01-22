import Navbar from "@/components/backoffice/navbar/navbar"

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
  