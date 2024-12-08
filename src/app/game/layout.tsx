import { Navbar } from "./navbar"

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="h-[calc(100vh-3.5rem)] pt-2">
        {children}
      </main>
    </>
  )
}
