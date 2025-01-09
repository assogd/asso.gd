export const metadata = {
  title: 'Page not found – Asso Stockholm',
  description: 'The page you are looking for could not be found.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Page not found – Asso Stockholm',
    description: 'The page you are looking for could not be found.'
  }
}

export default function NotFound() {
  return (
    <main className="text-center h-[calc(100vh-6.5em)] pb-8 flex items-center justify-center">
      <h1>Page not found</h1>
    </main>
  )
}
