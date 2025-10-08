import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const channel = searchParams.get('channel')
    
    // Build URL using the current request's origin
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`
    
    const arenaUrl = channel 
      ? `${baseUrl}/api/arena?action=channel-with-blocks&channel=${channel}`
      : `${baseUrl}/api/arena?action=channel&channel=adddgd-about`
    
    let cacheInfo = {}
    
    try {
      const response = await fetch(arenaUrl, { 
        method: 'HEAD', // Only get headers, not the body
        cache: 'no-store' // Don't use cache for this check
      })
      
      const cacheControl = response.headers.get('cache-control')
      const lastModified = response.headers.get('last-modified')
      const etag = response.headers.get('etag')
      const date = response.headers.get('date')
      
      cacheInfo = {
        cacheControl,
        lastModified,
        etag,
        date,
        status: response.status,
        url: arenaUrl
      }
    } catch (error) {
      cacheInfo = {
        error: 'Could not fetch cache headers',
        details: error.message
      }
    }
    
    return NextResponse.json({
      cacheInfo,
      timestamp: new Date().toISOString(),
      note: 'Cache headers show when data was last fetched from Are.na'
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status', details: error.message },
      { status: 500 }
    )
  }
}
