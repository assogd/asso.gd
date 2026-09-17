'use client'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

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
      <ReactMarkdown>{announcement.message.markdown}</ReactMarkdown>
    </div>
  )
}

export default Announcement
