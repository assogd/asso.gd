'use client'
import { useEffect, useState } from 'react'
import { RichText } from '@graphcms/rich-text-react-renderer'

const Announcement = () => {
  const [announcement, setAnnouncement] = useState(null)

  useEffect(() => {
    async function fetchAnnouncement() {
      const response = await fetch('/api/announcement')
      const data = await response.json()
      setAnnouncement(data)
    }

    fetchAnnouncement()
  }, [])

  if (!announcement) return null

  return (
    <div className="max-w-2xl">
      <RichText content={announcement.message.raw} />
    </div>
  )
}

export default Announcement
