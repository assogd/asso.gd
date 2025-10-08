import { NextResponse } from 'next/server'
import { 
  fetchArenaChannel, 
  fetchArenaBlocks, 
  fetchArenaChannelForCarousel 
} from '@/lib/arena'

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

      case 'carousel':
        if (!channelSlug) {
          return NextResponse.json(
            { error: 'Channel slug is required for carousel action' },
            { status: 400 }
          )
        }
        data = await fetchArenaChannelForCarousel(channelSlug, { page: parseInt(page), per: parseInt(per) })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: channel, blocks, carousel' },
          { status: 400 }
        )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Are.na API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from Are.na', details: error.message },
      { status: 500 }
    )
  }
}
