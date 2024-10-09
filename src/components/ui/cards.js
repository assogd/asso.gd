'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Preview } from '@/components/ui/players'
import Link from 'next/link'
import { RegularImage } from '@/components/ui/images'
import { RichText } from '@graphcms/rich-text-react-renderer'

export const ClientCard = ({
  slug,
  name,
  location,
  description,
  icon,
  providedServices,
  url
}) => {
  const formatServiceName = (service) => {
    return service
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
  }

  // Extract domain name from URL
  const getDomainName = (url) => {
    try {
      const { hostname } = new URL(url)
      return hostname.replace('www.', '') // Remove 'www.' if present
    } catch (e) {
      return url // Fallback in case the URL is invalid
    }
  }

  // Custom animation for the seamless scrolling effect
  const scrollSpeed = 20 // Adjust speed for the scrolling (lower = slower)

  const marqueeVariants = {
    animate: {
      x: ['0%', '-100%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: scrollSpeed, // Adjust for speed
          ease: 'linear' // Smooth, linear movement
        }
      }
    }
  }

  return (
    <div className="w-72">
      <div className="border p-1 rounded flex flex-col gap-4">
        <div className="flex border-b">
          <div className="icon border-r aspect-square grow flex items-center p-4">
            <RegularImage
              file={icon}
              manualWidth={180}
              className="w-16 h-16 mx-auto"
            />
          </div>
          <h3 className="uppercase grow flex items-center justify-center p-4">
            {name}
          </h3>
        </div>

        <div className="text-center grid gap-4">
          <div className="px-3 py-3">
            <RichText content={description.raw} />
          </div>

          <div className="relative flex justify-center overflow-hidden pb-4">
            {/* Container to hide overflow and create seamless loop */}
            <motion.div
              className="flex gap-1 whitespace-nowrap"
              variants={marqueeVariants}
              animate="animate"
            >
              {/* The first set of services */}
              {providedServices.map((service, i) => (
                <div
                  key={i}
                  className="pt-[.55em] pb-[.15em] px-2 font-sans text-xs rounded-full mix-blend-multiply border uppercase whitespace-nowrap"
                >
                  {formatServiceName(service)}
                </div>
              ))}
              {/* The second set of services (duplicate to create continuous loop) */}
              {providedServices.map((service, i) => (
                <div
                  key={`duplicate-${i}`}
                  className="pt-[.55em] pb-[.15em] px-2 font-sans text-xs rounded-full mix-blend-multiply border uppercase whitespace-nowrap"
                >
                  {formatServiceName(service)}
                </div>
              ))}
            </motion.div>
            <div className="select-none absolute right-0 inset-y-0 bg-gradient-to-l from-white to-transparent w-8" />
            <div className="select-none absolute left-0 inset-y-0 bg-gradient-to-r from-white to-transparent w-8" />
          </div>
        </div>
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 block border rounded mt-[-1px] text-center"
          title={`Launches ${getDomainName(url)}`}
        >
          Launch
        </a>
      )}
    </div>
  )
}
