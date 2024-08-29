import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="p-2 pb-8 text-center flex flex-col gap-8 justify-center items-center fixed inset-0">
      <nav className="fixed left-4 top-4">
        <Link href="/">ADDD</Link>
      </nav>
      <h1>Page not found</h1>
    </main>
  )
}
