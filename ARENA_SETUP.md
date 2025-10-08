# Are.na API Integration Setup

This document explains how to set up and use the Are.na API integration in your ADDD project.

## 🔑 Authentication Setup

### 1. Get Are.na Access Token

1. Go to [Are.na Developer Settings](https://www.are.na/settings/developer)
2. Create a new application or use an existing one
3. Copy your access token

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
# Are.na Configuration
ARENA_ACCESS_TOKEN="your-arena-access-token-here"
```

## 🚀 Usage

### Server-Side Rendering

The integration is designed for server-side rendering. Data is fetched directly from Are.na API with Next.js caching:

```jsx
import { fetchArenaChannelWithBlocks } from '@/lib/arena'

export default async function MyPage() {
  const channel = await fetchArenaChannelWithBlocks('your-channel-slug')
  
  return (
    <div>
      <h1>{channel.title}</h1>
      <p>{channel.description}</p>
      <p>Last updated: {channel._fetchedAt}</p>
      {/* Render channel.contents */}
    </div>
  )
}
```

## 📡 API Functions

### Core Functions (`/src/lib/arena.js`)

- `fetchArenaChannel(channelSlug, options)` - Fetch channel data with caching
- `fetchArenaChannelWithBlocks(channelSlug, options)` - Fetch channel with blocks included

## 🔄 Cache Management

### Cache Behavior
- **Never automatically revalidates** - data stays cached until manually cleared
- **Manual revalidation** via `/api/revalidate-arena` endpoint
- **Timestamp tracking** - each response includes `_fetchedAt` timestamp

### Revalidation Methods

#### Revalidate by Path and Tag
```bash
curl -X POST https://your-domain.com/api/revalidate-arena \
  -H "Content-Type: application/json" \
  -d '{"path": "/arena", "tag": "arena-data"}'
```

#### Revalidate by Tag Only
```bash
curl -X POST https://your-domain.com/api/revalidate-arena \
  -H "Content-Type: application/json" \
  -d '{"tag": "arena-data"}'
```

#### Revalidate by Path Only
```bash
curl -X POST https://your-domain.com/api/revalidate-arena \
  -H "Content-Type: application/json" \
  -d '{"path": "/arena"}'
```

### When to Revalidate
- When you add new content to your Are.na channels
- When you want to refresh the data on your site
- During development when testing changes

## 🎨 Working with Raw Are.na Data

The integration returns raw Are.na data, so you can adapt it however you need:

```jsx
const channel = await fetchArenaChannelWithBlocks('your-channel-slug')

// channel contains:
// - channel.title, channel.description, channel.created_at, etc.
// - channel.contents[] array with all block data
// - Each block has: id, title, description, image, source, etc.
// - channel._fetchedAt timestamp for cache tracking

// Adapt the data for your specific use case
const adaptedBlocks = channel?.contents?.map(block => ({
  id: block.id,
  title: block.title,
  imageUrl: block.image?.display?.url,
  // ... whatever you need
}))
```

## 🔧 Development

### Dev Revalidate Button

In development mode, a floating revalidate button is available that:
- Shows the last update timestamp
- Allows manual cache revalidation
- Is hidden in production (timestamp still shows)

### Cache Status

Check when data was last fetched by looking at the `_fetchedAt` timestamp in the response or on the page.