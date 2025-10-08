import { NextResponse } from 'next/server'

// This would ideally be shared with the revalidate-arena route
// For now, we'll create a simple endpoint that shows how to track history
export async function GET(request) {
  try {
    // In a real implementation, you'd want to share this data
    // For now, this shows the concept
    
    return NextResponse.json({
      message: 'Revalidation history tracking',
      note: 'History is stored in the revalidate-arena endpoint',
      howToView: {
        method: 'GET or POST to /api/revalidate-arena',
        description: 'The response includes the last 10 revalidation entries',
        example: 'curl "https://your-domain.com/api/revalidate-arena?path=/arena"'
      },
      cacheStatus: {
        method: 'GET to /api/arena-status',
        description: 'Check cache headers and last fetch time',
        example: 'curl "https://your-domain.com/api/arena-status"'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('History check error:', error)
    return NextResponse.json(
      { error: 'Failed to check history', details: error.message },
      { status: 500 }
    )
  }
}
