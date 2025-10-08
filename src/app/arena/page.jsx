'use client'
import { ArenaCarousel, MultiChannelArenaCarousel } from '@/components/arena-carousel'
import { useState } from 'react'

export default function ArenaPage() {
  const [selectedChannel, setSelectedChannel] = useState('')
  const [customChannel, setCustomChannel] = useState('')

  // Example channels - replace with your actual Are.na channel slugs
  const exampleChannels = [
    'your-channel-slug-1',
    'your-channel-slug-2',
    'your-channel-slug-3'
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Are.na Integration Demo</h1>
          
          {/* Channel Selection */}
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-2">Select Example Channel:</label>
              <select 
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose a channel...</option>
                {exampleChannels.map(channel => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>
            
            <div className="text-gray-500">or</div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Enter Custom Channel:</label>
              <input
                type="text"
                value={customChannel}
                onChange={(e) => setCustomChannel(e.target.value)}
                placeholder="channel-slug"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-32">
        {selectedChannel && (
          <div className="mb-8">
            <div className="max-w-4xl mx-auto px-4 mb-4">
              <h2 className="text-xl font-semibold mb-2">Single Channel: {selectedChannel}</h2>
            </div>
            <ArenaCarousel 
              channelSlug={selectedChannel}
              fallbackContent={
                <div className="text-center">
                  <p className="text-gray-600">This channel doesn't exist or has no content.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure the channel slug is correct and the channel is public.
                  </p>
                </div>
              }
            />
          </div>
        )}

        {customChannel && (
          <div className="mb-8">
            <div className="max-w-4xl mx-auto px-4 mb-4">
              <h2 className="text-xl font-semibold mb-2">Custom Channel: {customChannel}</h2>
            </div>
            <ArenaCarousel 
              channelSlug={customChannel}
              fallbackContent={
                <div className="text-center">
                  <p className="text-gray-600">This channel doesn't exist or has no content.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure the channel slug is correct and the channel is public.
                  </p>
                </div>
              }
            />
          </div>
        )}

        {!selectedChannel && !customChannel && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-2xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-4">Welcome to Are.na Integration</h2>
              <p className="text-gray-600 mb-6">
                This demo shows how to integrate Are.na channels into your carousel. 
                Select an example channel or enter a custom channel slug to get started.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg text-left">
                <h3 className="font-semibold mb-3">How to use:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Get your Are.na access token from the developer settings</li>
                  <li>Add it to your <code className="bg-gray-200 px-1 rounded">.env.local</code> file as <code className="bg-gray-200 px-1 rounded">ARENA_ACCESS_TOKEN</code></li>
                  <li>Enter a public Are.na channel slug above</li>
                  <li>The carousel will display all blocks from that channel</li>
                </ol>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Example Usage in Code:</h4>
                <pre className="text-sm text-blue-800 bg-blue-100 p-3 rounded overflow-x-auto">
{`import { ArenaCarousel } from '@/components/arena-carousel'

export default function MyPage() {
  return (
    <ArenaCarousel 
      channelSlug="your-channel-slug"
      options={{ per: 20 }}
    />
  )
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
