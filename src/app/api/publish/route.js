import { NextResponse } from 'next/server'

export async function POST() {
  const revalidateUrl = process.env.PRODUCTION_REVALIDATE_URL
  const publishToken = process.env.PUBLISH_TOKEN

  if (!revalidateUrl || !publishToken) {
    return NextResponse.json(
      { error: 'Publishing is not configured' },
      { status: 503 }
    )
  }

  try {
    const response = await fetch(revalidateUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publishToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path: '/', tag: 'arena-data' }),
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
