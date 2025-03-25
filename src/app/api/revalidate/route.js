import { revalidatePath } from 'next/cache'

export async function POST(req) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.HYGRAPH_SECRET) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401
    })
  }

  try {
    const body = await req.json()

    if (!body?.data?.__typename) {
      return new Response(JSON.stringify({ message: 'Invalid payload' }), {
        status: 400
      })
    }

    const typename = body.data.__typename
    const slug = body.data.slug || null

    const pathsToRevalidate = []

    if (typename === 'Page') {
      pathsToRevalidate.push(slug ? `/${slug}` : '/')
    } else if (typename === 'Gallery' || typename === 'Slide') {
      pathsToRevalidate.push('/')
    } else if (typename === 'Settings') {
      pathsToRevalidate.push('/api/announcement')
    }

    pathsToRevalidate.forEach((path) => {
      revalidatePath(path)
      console.log(`✅ Revalidated: ${path}`)
    })

    return new Response(
      JSON.stringify({
        message: 'Revalidation complete',
        paths: pathsToRevalidate
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Revalidation error:', error)
    return new Response(
      JSON.stringify({ message: 'Internal error', error: error.message }),
      { status: 500 }
    )
  }
}
