'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Preview } from '@/components/ui/players'
import Link from 'next/link'
import { applyRandomFonts, replaceHyphenWithEnDash } from '@/lib/text'

export const ProjectCard = ({
  slug,
  title,
  video,
  preview,
  keyAttributes,
  className,
  autoPlay,
  videoAspectRatio
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [formattedTitle, setFormattedTitle] = useState(title)

  useEffect(() => {
    setFormattedTitle(applyRandomFonts(replaceHyphenWithEnDash(title), 4))
  }, [title])

  return (
    <Link href={`/project/${slug}`}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(className, 'grid gap-1')}
      >
        <Preview
          previewVideo={preview}
          video={video}
          shouldPlay={autoPlay || isHovered}
          videoAspectRatio
        />
        <div>
          <h3 className="font-wideSerif">{formattedTitle}</h3>
          {keyAttributes?.length
            ? keyAttributes.map((attribute) => (
                <div key={attribute.id} className="inline-flex gap-1 hidden">
                  <span className="font-wideSerif">{attribute.key}</span>
                  <span className="font-wideSerif">{attribute.value}</span>
                </div>
              ))
            : null}
        </div>
      </motion.div>
    </Link>
  )
}
