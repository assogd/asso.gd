import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

// Simple in-memory store for revalidation history
// In production, you might want to use a database or external storage
let revalidationHistory = []

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
    const timestamp = new Date().toISOString()

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
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || '/arena'
  const tag = searchParams.get('tag')
  
  try {
    const results = []
    const timestamp = new Date().toISOString()

    // Revalidate by path
    revalidatePath(path)
    results.push({ type: 'path', value: path })

    // Revalidate by tag if provided
    if (tag) {
      revalidateTag(tag)
      results.push({ type: 'tag', value: tag })
    }

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
