import { DevRevalidateButton } from '@/components/dev-revalidate-button'

export default async function ArenaPage() {
  // Fetch both channels server-side using the cached API route
  const [aboutChannel, mainChannel] = await Promise.allSettled([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/arena?action=channel-with-blocks&channel=adddgd-about`, {
      cache: 'force-cache' // Use cached data
    }).then(res => res.json()),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/arena?action=channel-with-blocks&channel=adddgd`, {
      cache: 'force-cache' // Use cached data
    }).then(res => res.json())
  ])

  return (
    <div className="min-h-screen bg-white">


      {/* Content */}
      <div className="pt-12">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          
          {/* About Channel */}
          <section>
            <h2 className="text-xl font-semibold mb-4">adddgd-about</h2>
            {aboutChannel.status === 'fulfilled' && aboutChannel.value ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{aboutChannel.value.title}</h3>
                  {aboutChannel.value.description && (
                    <p className="text-gray-600 mt-2">{aboutChannel.value.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2" data-fetched-at={aboutChannel.value._fetchedAt}>
                    Last fetched: {aboutChannel.value._fetchedAt ? new Date(aboutChannel.value._fetchedAt).toLocaleString() : 'Unknown'}
                  </p>
                </div>
                
                {aboutChannel.value.contents && aboutChannel.value.contents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aboutChannel.value.contents.slice(0, 6).map((block, index) => (
                      <div key={block.id || index} className="bg-white p-4 rounded border">
                        <div className="text-sm text-gray-500 mb-2">
                          {block.class || 'Block'} • {block.created_at ? new Date(block.created_at).toLocaleDateString() : 'No date'}
                        </div>
                        {block.title && (
                          <h4 className="font-medium mb-2">{block.title}</h4>
                        )}
                        {block.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-3">{block.description}</p>
                        )}
                        {block.image && (
                          <div className="mt-2">
                            <img 
                              src={block.image.display?.url || block.image.thumb?.url} 
                              alt={block.title || 'Block image'}
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                        )}
                        {block.source && (
                          <a 
                            href={block.source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View source →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No content available</p>
                )}
              </div>
            ) : (
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-red-600">Failed to load adddgd-about channel</p>
                {aboutChannel.status === 'rejected' && (
                  <p className="text-sm text-red-500 mt-2">{aboutChannel.reason?.message}</p>
                )}
              </div>
            )}
          </section>

          {/* Main Channel */}
          <section>
            <h2 className="text-xl font-semibold mb-4">adddgd</h2>
            {mainChannel.status === 'fulfilled' && mainChannel.value ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{mainChannel.value.title}</h3>
                  {mainChannel.value.description && (
                    <p className="text-gray-600 mt-2">{mainChannel.value.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2" data-fetched-at={mainChannel.value._fetchedAt}>
                    Last fetched: {mainChannel.value._fetchedAt ? new Date(mainChannel.value._fetchedAt).toLocaleString() : 'Unknown'}
                  </p>
                </div>
                
                {mainChannel.value.contents && mainChannel.value.contents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mainChannel.value.contents.slice(0, 6).map((block, index) => (
                      <div key={block.id || index} className="bg-white p-4 rounded border">
                        <div className="text-sm text-gray-500 mb-2">
                          {block.class || 'Block'} • {block.created_at ? new Date(block.created_at).toLocaleDateString() : 'No date'}
                        </div>
                        {block.title && (
                          <h4 className="font-medium mb-2">{block.title}</h4>
                        )}
                        {block.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-3">{block.description}</p>
                        )}
                        {block.image && (
                          <div className="mt-2">
                            <img 
                              src={block.image.display?.url || block.image.thumb?.url} 
                              alt={block.title || 'Block image'}
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                        )}
                        {block.source && (
                          <a 
                            href={block.source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View source →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No content available</p>
                )}
              </div>
            ) : (
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-red-600">Failed to load adddgd channel</p>
                {mainChannel.status === 'rejected' && (
                  <p className="text-sm text-red-500 mt-2">{mainChannel.reason?.message}</p>
                )}
              </div>
            )}
          </section>

          {/* Raw Data Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">adddgd-about</h3>
                <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  <pre className="text-xs">
                    {aboutChannel.status === 'fulfilled' ? 
                      JSON.stringify(aboutChannel.value, null, 2) : 
                      JSON.stringify({ error: aboutChannel.reason?.message }, null, 2)
                    }
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">adddgd</h3>
                <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  <pre className="text-xs">
                    {mainChannel.status === 'fulfilled' ? 
                      JSON.stringify(mainChannel.value, null, 2) : 
                      JSON.stringify({ error: mainChannel.reason?.message }, null, 2)
                    }
                  </pre>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Dev revalidate button */}
      <DevRevalidateButton />
    </div>
  )
}