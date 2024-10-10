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
    <div className="bg-white col-span-full border border-black p-4 text-center md:border-0 md:mt-0 md:p-0 md:text-left md:left-16 md:absolute md:top-4 z-10">
      <RichText content={announcement.message.raw} />
    </div>
  )
}

export default Announcement
