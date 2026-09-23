import { NextResponse } from 'next/server'

export async function POST(request) {
  const revalidateUrl = process.env.PRODUCTION_REVALIDATE_URL
  const publishToken = process.env.PUBLISH_TOKEN

  if (!revalidateUrl || !publishToken) {
    return NextResponse.json(
      { error: 'Publishing is not configured' },
      { status: 503 }
    )
  }

  // Publish the specific route the studio is looking at (falls back to
  // home) so publishing a project page doesn't have to revalidate the
  // whole site. The underlying Are.na data still shares one `arena-data`
  // tag, so all pages pick up fresh content next time they're rendered.
  let path = '/'
  try {
    const body = await request.json()
    if (typeof body?.path === 'string' && body.path.startsWith('/')) {
      path = body.path
    }
  } catch {
    // No/invalid JSON body - fall back to publishing the home page.
  }

  try {
    const response = await fetch(revalidateUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publishToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path, tag: 'arena-data' }),
      cache: 'no-store'
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Production revalidation failed' },
        { status: 502 }
      )
    }

    return NextResponse.json({ published: true })
  } catch (error) {
    console.error('Publish request failed:', error)
    return NextResponse.json(
      { error: 'Production revalidation failed' },
      { status: 502 }
    )
  }
}
