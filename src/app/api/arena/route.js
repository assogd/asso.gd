import { NextResponse } from 'next/server'
import { 
  fetchArenaChannel, 
  fetchArenaBlocks, 
  fetchArenaChannelWithBlocks 
} from '@/lib/arena'

// Cache configuration - never revalidate unless manually triggered
const CACHE_CONFIG = {
  next: { 
    revalidate: false, // Never automatically revalidate
    tags: ['arena-data'] // Tag for manual revalidation
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const channelSlug = searchParams.get('channel')
    const blockId = searchParams.get('blockId')
    const page = searchParams.get('page') || 1
    const per = searchParams.get('per') || 20

    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      )
    }

    let data

    switch (action) {
      case 'channel':
        if (!channelSlug) {
          return NextResponse.json(
            { error: 'Channel slug is required for channel action' },
            { status: 400 }
          )
        }
        data = await fetchArenaChannel(channelSlug)
        break

      case 'blocks':
        if (!channelSlug) {
          return NextResponse.json(
            { error: 'Channel slug is required for blocks action' },
            { status: 400 }
          )
        }
        data = await fetchArenaBlocks(channelSlug, { page: parseInt(page), per: parseInt(per) })
        break

      case 'channel-with-blocks':
        if (!channelSlug) {
          return NextResponse.json(
            { error: 'Channel slug is required for channel-with-blocks action' },
            { status: 400 }
          )
        }
        data = await fetchArenaChannelWithBlocks(channelSlug, { page: parseInt(page), per: parseInt(per) })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: channel, blocks, channel-with-blocks' },
          { status: 400 }
        )
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      }
    })
  } catch (error) {
    console.error('Are.na API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from Are.na', details: error.message },
      { status: 500 }
    )
  }
}
