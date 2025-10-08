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

## 🚀 Usage Examples

### Basic Channel Display

```jsx
import { ArenaCarousel } from '@/components/arena-carousel'

export default function MyPage() {
  return (
    <ArenaCarousel 
      channelSlug="your-channel-slug"
      options={{ per: 20 }}
    />
  )
}
```

### Multiple Channels

```jsx
import { MultiChannelArenaCarousel } from '@/components/arena-carousel'

export default function MyPage() {
  return (
    <MultiChannelArenaCarousel 
      channelSlugs={['channel-1', 'channel-2', 'channel-3']}
      options={{ per: 10 }}
    />
  )
}
```

### Using Hooks Directly

```jsx
import { useArenaChannel, useArenaBlocks } from '@/hooks/use-arena'

export default function MyComponent() {
  const { channel, isLoading, isError } = useArenaChannel('your-channel-slug')
  const { blocks } = useArenaBlocks('your-channel-slug', { per: 20 })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading channel</div>

  return (
    <div>
      <h1>{channel.title}</h1>
      <p>{channel.description}</p>
      {/* Render blocks */}
    </div>
  )
}
```

## 📡 API Endpoints

The integration provides several API endpoints:

### `/api/arena?action=channel&channel=SLUG`
Fetches a complete channel with metadata.

### `/api/arena?action=blocks&channel=SLUG&page=1&per=20`
Fetches blocks from a channel with pagination.

### `/api/arena?action=channel-with-blocks&channel=SLUG&page=1&per=20`
Fetches channel data with blocks included.

### `/api/revalidate-arena`
Revalidates cached Are.na data. Supports both GET and POST methods.

## 🎨 Customization

### Working with Raw Are.na Data

The integration returns raw Are.na data, so you can adapt it however you need:

```jsx
import { useArenaChannelWithBlocks } from '@/hooks/use-arena'

const { channel, isLoading, isError } = useArenaChannelWithBlocks('your-channel-slug')

// channel contains:
// - channel.title, channel.description, channel.created_at, etc.
// - channel.blocks[] array with all block data
// - Each block has: id, title, description, image, source, etc.

// Adapt the data for your specific use case
const adaptedBlocks = channel?.blocks?.map(block => ({
  // Your custom transformation here
  id: block.id,
  title: block.title,
  imageUrl: block.image?.display?.url,
  // ... whatever you need
}))
```

### Custom Styling

The carousel components accept all the same props as your existing `MainCarousel`:

```jsx
<ArenaCarousel 
  channelSlug="your-channel"
  carouselProps={{
    // Any props you'd pass to MainCarousel
    customClassName: "my-custom-class"
  }}
/>
```

## 🔧 Available Functions

### Core API Functions (`/src/lib/arena.js`)

- `fetchArenaChannel(channelSlug, options)` - Fetch channel data
- `fetchArenaBlocks(channelSlug, options)` - Fetch channel blocks
- `fetchArenaBlock(blockId)` - Fetch specific block
- `searchArenaChannels(query, options)` - Search channels
- `fetchArenaUser(username)` - Fetch user data
- `fetchArenaChannelWithBlocks(channelSlug, options)` - Fetch channel with blocks

### React Hooks (`/src/hooks/use-arena.js`)

- `useArenaChannel(channelSlug, options)` - Hook for channel data
- `useArenaBlocks(channelSlug, options)` - Hook for blocks data
- `useArenaChannelWithBlocks(channelSlug, options)` - Hook for channel with blocks data
- `useMultipleArenaChannels(channelSlugs, options)` - Hook for multiple channels

### Components (`/src/components/arena-carousel.js`)

- `ArenaCarousel` - Single channel carousel
- `MultiChannelArenaCarousel` - Multiple channels carousel

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch data from Are.na"**
   - Check that your `ARENA_ACCESS_TOKEN` is set correctly
   - Verify the channel slug exists and is public
   - Check the browser console for detailed error messages

2. **"No content found in this channel"**
   - Ensure the channel has blocks/content
   - Check that the channel is public
   - Verify the channel slug is correct

3. **CORS Issues**
   - The API calls are made server-side, so CORS shouldn't be an issue
   - If you're making direct client-side calls, you may need to proxy through your API routes

### Debug Mode

Enable debug logging by setting `IS_DEV_MODE=true` in your environment variables.

## 🔄 Cache Management

The Are.na integration uses aggressive caching to improve performance:

### **Cache Behavior:**
- **Never auto-revalidates** - Data is cached indefinitely
- **Manual revalidation only** - Use the revalidation endpoint to update data
- **Tagged caching** - All Are.na data is tagged with `arena-data`

### **Revalidation Methods:**

#### **1. Revalidate by Path (GET):**
```bash
curl "https://your-domain.com/api/revalidate-arena?path=/arena"
```

#### **2. Revalidate by Path (POST):**
```bash
curl -X POST "https://your-domain.com/api/revalidate-arena" \
  -H "Content-Type: application/json" \
  -d '{"path": "/arena"}'
```

#### **3. Revalidate by Tag:**
```bash
curl -X POST "https://your-domain.com/api/revalidate-arena" \
  -H "Content-Type: application/json" \
  -d '{"tag": "arena-data"}'
```

#### **4. Revalidate Both:**
```bash
curl -X POST "https://your-domain.com/api/revalidate-arena" \
  -H "Content-Type: application/json" \
  -d '{"path": "/arena", "tag": "arena-data"}'
```

### **When to Revalidate:**
- After updating content in Are.na
- When you want to refresh the data
- Before important presentations or deployments

## 📊 Tracking Revalidation History

### **View Revalidation History:**
The revalidation endpoint now tracks and returns the last 10 revalidation events:

```bash
curl "https://your-domain.com/api/revalidate-arena?path=/arena"
```

**Response includes:**
```json
{
  "revalidated": true,
  "results": [{"type": "path", "value": "/arena"}],
  "timestamp": "2025-10-08T07:06:27.648Z",
  "history": [
    {
      "timestamp": "2025-10-08T07:06:27.648Z",
      "results": [{"type": "path", "value": "/arena"}],
      "method": "GET"
    }
  ]
}
```

### **Check Cache Status:**
View when data was last fetched from Are.na:

```bash
curl "https://your-domain.com/api/arena-status"
```

**Response includes:**
```json
{
  "cacheInfo": {
    "cacheControl": "public, max-age=31536000, immutable",
    "date": "Wed, 08 Oct 2025 07:06:25 GMT",
    "status": 200
  },
  "timestamp": "2025-10-08T07:06:25.013Z",
  "note": "Cache headers show when data was last fetched from Are.na"
}
```

### **History Endpoint:**
Get information about tracking:

```bash
curl "https://your-domain.com/api/arena-history"
```

## 📚 Resources

- [Are.na API Documentation](https://dev.are.na/)
- [Are.na JavaScript SDK](https://www.npmjs.com/package/are.na)
- [Are.na Developer Portal](https://www.are.na/settings/developer)
