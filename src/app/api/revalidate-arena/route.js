import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request) {
  try {
    const { path, tag } = await request.json()
    
    if (!path && !tag) {
      return NextResponse.json(
        { error: 'Either path or tag is required' },
        { status: 400 }
      )
    }

    const results = []

    // Revalidate by path if provided
    if (path) {
      revalidatePath(path)
      results.push({ type: 'path', value: path })
    }

    // Revalidate by tag if provided
    if (tag) {
      revalidateTag(tag)
      results.push({ type: 'tag', value: tag })
    }
    
    return NextResponse.json({
      revalidated: true,
      results: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate', details: error.message },
      { status: 500 }
    )
  }
}

// Also support GET for easy testing
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || '/arena'
  const tag = searchParams.get('tag')
  
  try {
    const results = []

    // Revalidate by path
    revalidatePath(path)
    results.push({ type: 'path', value: path })

    // Revalidate by tag if provided
    if (tag) {
      revalidateTag(tag)
      results.push({ type: 'tag', value: tag })
    }
    
    return NextResponse.json({
      revalidated: true,
      results: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate', details: error.message },
      { status: 500 }
    )
  }
}
