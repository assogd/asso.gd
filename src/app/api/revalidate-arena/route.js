import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

// Simple in-memory store for revalidation history
// In production, you might want to use a database or external storage
const ARENA_TAG = 'arena-data'
let revalidationHistory = []

function isAuthorized(request) {
  if (process.env.HIDE_PUBLISH_BUTTON === 'true') {
    return false
  }

  const expectedToken = process.env.REVALIDATE_TOKEN
  if (!expectedToken) {
    return process.env.NODE_ENV !== 'production'
  }

  return request.headers.get('authorization') === `Bearer ${expectedToken}`
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { path, tag = ARENA_TAG } = await request.json()

    const results = []
    const timestamp = new Date().toISOString()

    // Revalidate by path if provided
    if (path) {
      revalidatePath(path)
      results.push({ type: 'path', value: path })
    }

    // Expire immediately so the next request refetches instead of serving
    // stale content while revalidating.
    revalidateTag(tag, { expire: 0 })
    results.push({ type: 'tag', value: tag })

    // Store revalidation history
    const historyEntry = {
      timestamp,
      results,
      method: 'POST'
    }
    revalidationHistory.unshift(historyEntry) // Add to beginning
    
    // Keep only last 50 entries
    if (revalidationHistory.length > 50) {
      revalidationHistory = revalidationHistory.slice(0, 50)
    }
    
    return NextResponse.json({
      revalidated: true,
      results: results,
      timestamp,
      history: revalidationHistory.slice(0, 10) // Return last 10 entries
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
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || '/arena'
  const tag = searchParams.get('tag') || ARENA_TAG
  
  try {
    const results = []
    const timestamp = new Date().toISOString()

    // Revalidate by path
    revalidatePath(path)
    results.push({ type: 'path', value: path })

    // Expire immediately so the next request refetches instead of serving
    // stale content while revalidating.
    revalidateTag(tag, { expire: 0 })
    results.push({ type: 'tag', value: tag })

    // Store revalidation history
    const historyEntry = {
      timestamp,
      results,
      method: 'GET'
    }
    revalidationHistory.unshift(historyEntry) // Add to beginning
    
    // Keep only last 50 entries
    if (revalidationHistory.length > 50) {
      revalidationHistory = revalidationHistory.slice(0, 50)
    }
    
    return NextResponse.json({
      revalidated: true,
      results: results,
      timestamp,
      history: revalidationHistory.slice(0, 10) // Return last 10 entries
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate', details: error.message },
      { status: 500 }
    )
  }
}
