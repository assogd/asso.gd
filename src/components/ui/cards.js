'use client'
import { motion } from 'framer-motion'
import { useState, useEffect, Children } from 'react'
import clsx from 'clsx'
import { Preview } from '@/components/ui/players'
import Link from 'next/link'
import { RegularImage } from '@/components/ui/images'
import ReactMarkdown from 'react-markdown'
import {
  CFHILL,
  Forma,
  Hem,
  Muscadet,
  SubRosa,
  Slutet,
  Takeout
} from '@/components/ui/svgs/logotypes'
import Slider from 'react-infinite-logo-slider'
import { useMedia } from 'use-media'

export const PortraitClientCard = ({
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
            <ReactMarkdown>{description.raw}</ReactMarkdown>
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

export const LandscapeClientCard = ({
  slug,
  name,
  location,
  description,
  icon,
  providedServices,
  url
}) => {
  const [isHovered, setIsHovered] = useState(false)

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

  // Event handlers for hover and touch events
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  const handleTouchStart = () => setIsHovered(true)
  const handleTouchEnd = () => setIsHovered(false)

  return (
    <div
      className="relative select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="py-1 border-dashed flex gap-4 items-center justify-between">
        <h3 className="uppercase flex gap-2 items-center basis-36">{name}</h3>
        <div className="grow basis-36">{location}</div>
        <div className="hidden lg:flex gap-2">
          {providedServices.map((service, i) => (
            <div key={i} className="whitespace-nowrap">
              {formatServiceName(service)}
              {i + 1 !== providedServices.length && ','}
            </div>
          ))}
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            title={`Launches ${getDomainName(url)}`}
          >
            Launch
          </a>
        )}
      </div>

      {/* Show fixed container on hover or touch */}
      <div
        className={clsx(
          `fixed inset-0 flex flex-col gap-4 justify-center items-center text-center transition-opacity duration-300 pointer-events-none z-20`,
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex flex-col gap-8 p-8 justify-center items-center">
          <RegularImage
            file={icon}
            manualWidth={180}
            className="w-72 h-72 flex items-center justify-center"
          />
          {description?.raw && (
            <div className="bg-white p-2 hidden">
              <ReactMarkdown>{description.raw}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const LogoSlider = ({ children }) => {
  const numOfChildren = Children.count(children)
  const isWideEnough = useMedia(`(min-width: ${numOfChildren * 200}px)`)

  return isWideEnough ? (
    <div
      className="grid max-w-full overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${numOfChildren}, 1fr)`
      }}
    >
      {children}
    </div>
  ) : (
    <Slider
      width="200px"
      duration={60}
      pauseOnHover={false}
      blurBorders={true}
      blurBorderColor={'#fff'}
    >
      {children}
    </Slider>
  )
}

export const PortraitClientCard2 = ({
  slug,
  name,
  location,
  description,
  icon,
  providedServices,
  url
}) => {
  // Extract domain name from URL
  const getDomainName = (url) => {
    try {
      const { hostname } = new URL(url)
      return hostname.replace('www.', '') // Remove 'www.' if present
    } catch (e) {
      return url // Fallback in case the URL is invalid
    }
  }

  const logoMap = {
    cfhill: CFHILL,
    forma: Forma,
    hem: Hem,
    muscadet: Muscadet,
    subrosa: SubRosa,
    slutet: Slutet,
    takeout: Takeout
  }

  const normalizedSlug = slug.replace(/-/g, '').toLowerCase()
  const LogoComponent = logoMap[normalizedSlug]

  return (
    LogoComponent && (
      <Slider.Slide className="w-full flex justify-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          title={`Launches ${getDomainName(url)}`}
        >
          <div className="w-16 aspect-square">
            <LogoComponent className="w-full h-full" />
          </div>
        </a>
      </Slider.Slide>
    )
  )

  return (
    <div className="w-36 mx-auto flex flex-col items-center justify-baseline p-4">
      {LogoComponent && (
        <div className="w-16 aspect-square">
          <LogoComponent className="w-full h-full" />
        </div>
      )}
      <h3 className="hidden uppercase grow flex items-center justify-center p-4">
        {name}
      </h3>
    </div>
  )
}
