import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="p-2 pb-8 text-center flex flex-col gap-8 justify-center items-center fixed inset-0">
      <nav className={'fixed right-0 top-0 select-none'}>
        <Link href="/about" className={'block p-4'}>
          About the Studio
        </Link>
      </nav>
      <h1>Page not found</h1>
    </main>
  )
}
