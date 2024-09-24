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

  return (
    <div className="bg-[#F6F4E9] bg-[#ffefcf] border border-[#f7b955] p-6 rounded aspect-[3/4] w-80 text-center flex flex-col gap-4">
      <RegularImage file={icon} manualWidth={180} className="w-12 mx-auto" />
      <h3 className="uppercase">{name}</h3>
      <div className="font-sans text-sm">
        <RichText content={description.raw} />
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {providedServices.map((service, i) => (
          <div
            key={i}
            className="py-[.35em] px-2 font-sans text-xs bg-black/10 rounded-lg mix-blend-multiply text-black/80"
          >
            {formatServiceName(service)}
          </div>
        ))}
      </div>
      <p className="opacity-50 text-[#5A5747] font-sans text-sm">{location}</p>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5A5747] font-sans text-sm underline hover:text-black"
        >
          {getDomainName(url)}
        </a>
      )}
    </div>
  )
}
