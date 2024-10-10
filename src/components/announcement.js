'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

const Announcement = () => {
  return (
    <div className="bg-white col-span-full border border-black p-4 text-center md:border-0 md:mt-0 md:p-0 md:text-left md:left-16 md:absolute md:top-4 z-10">
      We can write something here, like an announcement
    </div>
  )
}

export default Announcement
